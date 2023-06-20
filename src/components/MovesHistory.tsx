import { TFriendlyCoordinates } from '../models/Coordinates';
import { TFigureColor } from '../models/Figure'
import './MovesHistory.css'


export type THISTORY_RECORD = {
  from: TFriendlyCoordinates;
  to: TFriendlyCoordinates;
  time: Date;
}

export interface IHistory {
  White: THISTORY_RECORD[];
  Black: THISTORY_RECORD[];
}


interface IProps {
  color: TFigureColor;
  records: THISTORY_RECORD[];
}
export const MovesHistory = ({ color, records }: IProps)  => {
  return (
    <div className='history'>
      <h4>Moves by {color}</h4>
      {records.map((move, index) => {
        return <div key={index}>{index + 1}. {move.from}-{move.to} at {move.time.toLocaleTimeString('ru-RU')}</div>
      })}
    </div>
  )
}