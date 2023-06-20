import './Network.css';
import { useCallback, useEffect, useRef, useState } from 'react'
import { NetworkService } from '../services/network';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { TFriendlyCoordinates } from '../models/Coordinates';

export type INetworkCallbackData = {
  to?: TFriendlyCoordinates;
  figure?: TFriendlyCoordinates;
  isHost?: boolean;
  restart?: boolean;
}
export type INetworkCallback = (data: INetworkCallbackData) => void;
interface IProps {
  renderBody: ({ send, subscribeOnMessage }: { send: INetworkCallback; subscribeOnMessage: (callback: INetworkCallback) => void }) => void
}
export const NetworkComponent = ({ renderBody }: IProps) => {
  const networkRef = useRef<NetworkService | null>(null)

  const subscribers = useRef<INetworkCallback[]>([])
  const subscribeOnMessage = useCallback((callback: (data: INetworkCallbackData) => void) => {
    if (!subscribers.current.includes(callback)) {
      subscribers.current.push(callback);
    }

  }, [])
  const send = useCallback((data: INetworkCallbackData) => {
    networkRef.current?.send(JSON.stringify(data))
  }, [])

  const offerRef = useRef<HTMLTextAreaElement | null>(null);
  const answerRef = useRef<HTMLTextAreaElement | null>(null);

  const [isHost, setIsHost] = useState<null | boolean>(null);

  const [offer, setOffer] = useState('');
  const [offerSubmitted, setOfferSubmitted] = useState(false);
  const [answer, setAnswer] = useState('');

  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = useCallback((isHost: boolean) => {
    const onOpen = (e: any) => {
      console.log('Data channel is opened', e)
      setIsConnected(true);
      send({ isHost })
    }
    const onLocalDescriptionSet = (data: string) => {
      if (isHost) {
        setOffer(data);
      } else {
        setAnswer(data)
      }
    }
    const onMessage = (event: any) => {
      console.log('onMessage', event);
      subscribers.current.forEach(fn => fn(JSON.parse(event.data)));
    }

    setIsHost(isHost);
    networkRef.current = new NetworkService(isHost, onOpen, onMessage, onLocalDescriptionSet);
    networkRef.current.oniceconnectionstatechange = (status) => {
      console.log('onStatusChange', status);
      //setIsConnected(status === 'connected');
    }
    if (isHost) {
      networkRef.current.createOffer();
    }
  }, [send]);

  const onDone = useCallback(() => {
    if (!isHost) {
      setOfferSubmitted(true);
      networkRef.current?.setRemoteDescription(JSON.parse(offer)).then(() => {
        console.log('setRemoteDescription client')
        networkRef.current?.createAnswer();
      })
    } else {
      networkRef.current?.setRemoteDescription(JSON.parse(answer)).then(() => {
        console.log('setRemoteDescription host')
      });
    }
  }, [isHost, offer, answer]);

  const renderHost = () => {
    return <>
      <h5>HOST</h5>
      {!offer ? <>
        Generating an invitation message... wait a bit
      </> :
        <>
          <div>Send the message below to the second player <CopyToClipboard text={offer}><a>click to copy</a></CopyToClipboard>:</div>
          <br />
          <textarea ref={offerRef} className='offer' value={offer} readOnly={true} />
          <br />
          <div>Paste the response message you received from him/her:</div>
          <textarea className='offer' value={answer} onChange={e => setAnswer(e.target.value)} />
          <div className='buttonWrapper'>
            <button disabled={!answer} onClick={onDone}>DONE</button>
          </div>
        </>}
    </>
  }

  const renderClient = () => {
    return <>
      <h5>CLIENT</h5>
      {!offerSubmitted ? <>
        <div>Past the invite message you received:</div>
        <br />
        <textarea className='offer' text={offer} onChange={e => setOffer(e.target.value)} />
        <div className='buttonWrapper'>
          <button disabled={!offer} onClick={onDone}>DONE</button>
        </div>
      </> :
        answer ? <>
          <div>Send the response message back to the first player&nbsp;<CopyToClipboard text={answer}><a>click to copy</a></CopyToClipboard>:</div>
          <textarea ref={answerRef} className='offer' value={answer} readOnly={true} />
        </> : 'Generate a response message... wait a bit'
      }
    </>
  }

  if (isConnected) {
    return <>
      {renderBody({ send, subscribeOnMessage })}
      Connected
    </>;
  }

  return (<>
    {renderBody({ send, subscribeOnMessage })}
    {isHost === null && <div className='connectButtons'>
      <div>PLAY ONLINE&nbsp;</div>
      <button onClick={() => handleConnect(true)}>HOST</button>
      <button onClick={() => handleConnect(false)}>JOIN</button>
    </div>}
    {
      isHost === true ? renderHost()
        : isHost === false ? renderClient()
          : null
    }
  </>
  )
}