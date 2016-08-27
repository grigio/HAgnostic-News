import { AppRegistry } from 'react-native'
import App from './App'

// App registration and rendering
AppRegistry.registerComponent('MyApp', () => App)
AppRegistry.runApplication('MyApp', { rootTag: document.getElementById('root') })