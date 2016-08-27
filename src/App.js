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

/*
          <Text style={[styles.row,{fontWeight:'bold'}]}>({Platform.OS})</Text>


 */
// Components
const Card = ({ children }) => <View style={styles.card}>{children}</View>
// const Title = ({ children }) => <Text style={styles.title}>{children}</Text>
// const Photo = ({ uri }) => <Image source={{ uri }} style={styles.image} />

// TODO: about page grigio.org
/*
        <TouchableHighlight style={styles.button} underlayColor="lightgray"
          onPress={() => onFetch() }>
          <View>
            <Text style={{fontSize:20}}>
            ★ { loading ? 'Loading..' : 'Fetch'}
            </Text>
          </View>
        </TouchableHighlight>

                    <Image source={logo} />

 */

class AppContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      filter: 'Top', // 'Latest''
      page: 0,
      errors: {},
      items: []
      // items: [
      //   {
      //     created_at: "2016-08-08T13:09:09.000Z",
      //     title: "Moving 12 years of email from GMail to FastMail",
      //     url: "https://cpbotha.net/2016/08/06/moving-12-years-of-email-from-gmail-to-fastmail/",
      //     author: "cpbotha",
      //     points: 602,
      //     story_text: null,
      //     comment_text: null,
      //     num_comments: 346,
      //     story_id: null,
      //     story_title: null,
      //     story_url: null,
      //     parent_id: null,
      //     created_at_i: 1470661749
      //   },
      // ]
    }
    this.loadMore = this.loadMore.bind(this)
    this.loadItems = this.loadItems.bind(this)
    this.openUrl = this.openUrl.bind(this)
    this.toggleOverlay = this.toggleOverlay.bind(this)
    

  }

  componentDidMount(){
    // default items load
    this.loadItems(this.state.filter)
  }

  openUrl(url){
    // console.warn(url)
    if (Platform.OS === 'web')
      window.open(url,'_blank');
    if (Platform.OS === 'android' || Platform.OS === 'ios')
      Linking.openURL(url).catch(err => console.error('An error occurred', err));
  }

  loadItems(filter) {
    this.setState({filter: filter})
    // HACK: to avoid React state change race condition
    setTimeout(()=>{
      this.loadMore('reset')
    },0)

  }

  loadMore(mode) {
    const page = (mode === 'reset') ? 0 : this.state.page
    this.setState({loading:true})
    const urls = {
      'Top': `https://hn.algolia.com/api/v1/search_by_date?tags=front_page&page=${page}`,
      'Latest': `https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${page}`,
    }
    const fetchUrl = urls[this.state.filter]
    console.log(fetchUrl)
    fetch(fetchUrl)
      .then(response => response.json())
      .then(data => {
        const previousItems = (page === 0) ? [] : this.state.items
        //console.log(page, previousItems)
        this.setState({
          items: [ ...previousItems, ...data.hits],
          loading:false,
          errors:{},
          page: page+1
        })
      })
      .catch((error) => {
        this.setState({
          loading: false,
          errors: {
            error
          }
        })
        console.error(error,page);
      });
  }

  toggleOverlay() {
    const {overlayVisible} = this.state
    this.setState({overlayVisible: !overlayVisible})
  }

  render(){
    return <App items={this.state.items}
                errors={this.state.errors}
                loading={this.state.loading}
                filter={this.state.filter}
                overlayVisible={this.state.overlayVisible}
                onOpenUrl={this.openUrl}
                onLoadItems={this.loadItems}
                onLoadMore={this.loadMore}
                onToggleOverlay={this.toggleOverlay}
                />
  }
}

const Overlay = ({children, visible}) => (
  (visible) ? (
    <View style={{position:'absolute', zIndex:1, padding:10,  marginTop: (Platform.OS === 'ios') ? 68 : 48, width: Dimensions.get('window').width, height:400, backgroundColor:'rgba(255,255,255,80)'}}>
      <Text style={{fontSize:28, marginLeft:Dimensions.get('window').width*0.89, backgroundColor:'rgba(52,52,52, 0.0)', color:'white', marginTop: -26, position:'absolute', zIndex:1}}>⏏</Text>
      {children}
    </View>) : <View></View>
)

class App extends React.Component {

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


export default AppContainer
