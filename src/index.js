import { AppRegistry } from 'react-native'
import AppContainer from './AppContainer'

// App registration and rendering
AppRegistry.registerComponent('MyApp', () => AppContainer)
AppRegistry.runApplication('MyApp', { rootTag: document.getElementById('root') })
