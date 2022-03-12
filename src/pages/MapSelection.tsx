import { useNavigate } from 'react-router'
import './mapselection.scss'

interface Props {
  
}
 
const MapSelection: React.FC<Props> = () => {

  const mapMenu = [
    {
      name: 'Map1',
      route: '/map1',
    },
    {
      name: 'Map2',
      route: '/map2',
    },
  ]
  
  const MapMenuItem: React.FC<{ name: string, to: string }> = (props) => {
    const navigate = useNavigate()
    const switchToMap = () => {
      navigate(props.to)
    }
    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div onMouseDown={switchToMap} className='map-menu-item'> {props.name} </div>
    )
  }

  return (
    <div className='map-selection'>
      {
        mapMenu.map(item => {
          return (<MapMenuItem key={item.name} name={item.name} to={item.route}></MapMenuItem>)
        })
      }
    </div>
  )
}
 
export default MapSelection