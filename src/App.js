import React from 'react'
import { Text, View,
  TouchableHighlight, ScrollView,
  StatusBar, ActivityIndicator, Linking, Dimensions,
  Platform, Image } from 'react-native'

// assets
import { color } from 'react-native-material-design-styles'
import logo from './y18.gif'
import styles from './AppStyles'

// utils
import { domainUrl } from './utils'
import moment from 'moment'

// ComponentsmarginTop: 
const Card = ({ children }) => <View style={styles.card}>{children}</View>

const Overlay = ({children, visible}) => (
  (visible) ? (

    <View style={{position:'absolute', marginTop: (Platform.OS === 'ios') ? 48 : 28,zIndex:1}}>
      <Text style={{fontSize:28, marginLeft:Dimensions.get('window').width*0.9, backgroundColor:'rgba(52,52,52, 0.0)', color:'white', zIndex:3}}>⏏</Text>
      <View style={{padding:10,  marginTop: -17, width: Dimensions.get('window').width, height:400, backgroundColor:'rgba(255,255,255,80)'}}>
      {children}      
      </View>
    </View>

    ) : <View></View>
)

export default class App extends React.Component {

  constructor(props) {
    super(props)
    this.scrollToTop = this.scrollToTop.bind(this)
  }

  scrollToTop() {
    if (Platform.OS === 'web')
      document.getElementsByClassName('scrollView')[0].scrollTo(0,0)
    // native
    if (Platform.OS === 'android' || Platform.OS === 'ios')
      
    this.refs._scrollView.scrollTo({x:0, y:0, animated:true});
  }

  render() {
    const { items, errors, loading, filter, overlayVisible, onLoadMore, onLoadItems, onOpenUrl, onToggleOverlay } = this.props

    const cursorStyle = Platform.OS === 'web' ? {cursor: 'pointer'} : {}

    return (
  <Card>
    {Platform.OS === 'android' ? (
      <StatusBar backgroundColor={'#d25500'} />
    ) : null}
    <View style={styles.body}>

    <Overlay visible={overlayVisible}>
      <Text style={{fontSize: 18}}>
        <Text style={{fontWeight:'bold'}}>HAgnostic News</Text> is a simple Hacker News reader for the Web and a React Native app (Android / iOS).
      </Text>
      <Text style={{fontSize: 18, marginTop: 20}}>
        Made with ❤ by
        <Text
          onPress={() => { onOpenUrl('https://grigio.org') } }>
          <Text style={{color:color.paperOrange600.color, fontWeight:'bold', padding:10}}>{" "}Luigi Maselli</Text>
        </Text>
        , source code: 
        <Text
          onPress={() => { onOpenUrl('https://github.com/grigio/HAgnostic-News') } }>
          <Text style={{color:color.paperOrange600.color, fontWeight:'bold', padding:10}}>{" "}github.com/grigio/HAgnostic-News</Text>
        </Text>
      </Text>
    </Overlay>

      <View style={[styles.column, styles.header,
        Platform.OS === 'ios' ? {height:75, paddingTop:20 } : {} ]}>
        <View style={[styles.row, {height:50}]}>
          <View style={styles.row}>
            <Image source={logo} style={{width:20}} />
            <Text style={[{fontWeight:'bold',paddingLeft:4}]}>HAgnostic News</Text>    
            <Text style={[{fontSize:12, paddingLeft:4}]}> {Platform.OS}</Text>    
          </View>
          <TouchableHighlight
            style={[styles.button, filter === 'Top' ? styles.buttonOrange:null]}
            underlayColor={color.paperOrange200.color}
            onPress={() => { onLoadItems('Top'); this.scrollToTop()} }>
            <View style={styles.row}>
            <Text style={{color:'white', fontWeight:'bold', paddingRight:5}}>Top</Text>{ filter === 'Top' && loading ? <ActivityIndicator /> : null}
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            style={[styles.button, filter === 'Latest' ? styles.buttonOrange:null]}
            underlayColor={color.paperOrange200.color}
            onPress={() => { onLoadItems('Latest'); this.scrollToTop() } }>
            <View style={styles.row}>
            <Text style={{color:'white', fontWeight:'bold', paddingRight:5}}>Latest</Text>{ filter === 'Latest' && loading ? <ActivityIndicator /> : null}
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={color.paperOrange200.color}
            onPress={() => { onToggleOverlay() } }>
            <Text style={{color:'white', fontWeight:'bold', padding:10}}>?</Text>
          </TouchableHighlight>
        </View>
        { Object.keys(errors).length > 0 ? (
          <View style={[styles.row, {flex: 1, backgroundColor:'red'}]}>
            { Object.keys(errors).map( (error, i) => (
              <Text key={i}>. {errors[error].message}</Text>
            )
            )}
          </View>
        ): null}

      </View>

          <View style={styles.scrollViewContainer}>
            <ScrollView
              ref='_scrollView'
              className='scrollView'
              contentContainerStyle={styles.scrollViewContentContainerStyle}
              scrollEventThrottle={1} // 1 event per second
              style={styles.scrollViewStyle}
            >
              {items.map((item, i) => (
                <View key={i}>
                  <View style={styles.itemRow}>
                    <Text style={{flex:1}}>
                      <Text
                        style={{fontWeight:'bold', fontSize:18}}
                        onPress={() => onOpenUrl(item.url) }>{i+1}. {item.title}</Text>
                    <Text style={[{flex:1, color: '#979797'}, cursorStyle]}> {item.url && domainUrl(item.url)}</Text>

                    </Text>

                  </View>
                  <View style={styles.itemSubRow}>
                    <Text style={{padding:2}}>{item.points} points </Text>
                    <Text style={{padding:2}}> by {item.author}</Text>
                    <Text style={{padding:2}}>| {item.num_comments} c. |</Text>
                    <Text
                      onPress={() => onOpenUrl(`https://news.ycombinator.com/item?id=${item.objectID}`)}
                      style={[{padding:2, flex:1,textDecorationLine: 'underline'}, cursorStyle]}> { moment(item.created_at).fromNow() }</Text>
                  </View>
                </View>

              ))}
              <View style={[styles.itemRow, styles.buttonRow]}>
                <TouchableHighlight
                  style={[styles.button, styles.buttonGray]}
                  underlayColor={color.paperOrange200.color}
                  onPress={() => onLoadMore() }>
                  <View style={[styles.row, {height:20}]}>
                  <Text
                    style={{fontWeight: 'bold', fontSize: 16, color:color.paperGrey500.color}}>
                    { loading ? null : 'Load more'}
                  </Text>
                  { loading ? <ActivityIndicator /> : null}
                  </View>
                </TouchableHighlight>
              </View>
            </ScrollView>
          </View>
    </View>
  </Card>
)

  }
}