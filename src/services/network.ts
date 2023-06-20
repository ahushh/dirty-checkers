/* eslint-disable @typescript-eslint/no-non-null-assertion */


const config = {
  'iceServers': [{
    //urls: 'stun:23.21.150.121'
    urls: 'stun:stun.stunprotocol.org'
  }]
};

type TDataChannelEventHandler = (event: any) => void


export class NetworkService {
  peerConnection: RTCPeerConnection;
  dataChannel?: RTCDataChannel;

  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
  status?: undefined;
  oniceconnectionstatechange?: (status?: string) => void;

  constructor(isHost: boolean, onOpen: TDataChannelEventHandler, onMessage: TDataChannelEventHandler, public onLocalDescriptionset: TDataChannelEventHandler) {
    this.peerConnection = this.createPeerConnection()
    if (isHost) {
      this.dataChannel = this.createDataChannel();
      this.setDataChannelHandlers(onOpen, onMessage)
    } else {
      this.peerConnection.ondatachannel = (event: RTCDataChannelEvent) => {
        console.log('ondatachannel', event)
        this.dataChannel = event.channel;
        this.setDataChannelHandlers(onOpen, onMessage)
      }
    }
  }

  send(data: string) {
    if (!(this.status === 'connected')) {
      return
    }
    try {
      this.dataChannel!.send(data)
    } catch (e) {
      console.error('error sending data', e)
    }
  }

  createOffer() {
    return this.peerConnection.createOffer()
      .then(offer => {
        this.offer = offer;
        return this.peerConnection.setLocalDescription(offer)
      }).then(() => {
        console.log('offer created', this.offer)
        return this.offer;
      })
      .catch(err => console.error('error creating offer', err))
  }

  createAnswer() {
    return this.peerConnection.createAnswer().then(answer => {
      this.answer = answer;
      return this.peerConnection.setLocalDescription(answer)
    }).then(() => {
      console.log('answer created', this.answer)
      return this.answer;
    }).catch(err => console.error('error creating answer', err))
  }

  setRemoteDescription(answerOrOffer: RTCSessionDescriptionInit) {
    return this.peerConnection.setRemoteDescription(answerOrOffer).then(() => {
      console.log('remove description is set')
    }).catch(err => console.error('error setRemoteDescription', err));
  }
  setLocalDescription(answerOrOffer: RTCSessionDescriptionInit) {
    return this.peerConnection.setLocalDescription(answerOrOffer).then(() => {
      console.log('remove description is set')
    }).catch(err => console.error('error setLocalDescription', err));
  }


  private createPeerConnection() {
    const peerConnection = new RTCPeerConnection(config);
    peerConnection.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
      console.log('onicecandidate', event)
      if (event.candidate === null) {
        this.onLocalDescriptionset(JSON.stringify(this.peerConnection.localDescription));
      }
    }
    peerConnection.onconnectionstatechange = (event: Event) => {
      console.log('onconnectionstatechange', event)
    }
    peerConnection.oniceconnectionstatechange = (event: any) => {
      this.status = event?.target?.iceConnectionState;
      console.log('oniceconnectionstatechange', event?.target?.iceConnectionState)
      this.oniceconnectionstatechange?.(this.status)
    }
    return peerConnection;
  }

  private createDataChannel() {
    return this.peerConnection.createDataChannel('game');
  }

  private setDataChannelHandlers(onOpen: TDataChannelEventHandler, onMessage: TDataChannelEventHandler) {
    this.dataChannel!.onopen = onOpen;
    this.dataChannel!.onmessage = onMessage;
  }

}
