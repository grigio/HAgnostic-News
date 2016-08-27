import React from 'react'
import { Text, View,
  TouchableHighlight, ScrollView,
  StatusBar, ActivityIndicator, Linking, Dimensions,
  Platform, Image } from 'react-native'

import App from './App'

export default class AppContainer extends React.Component {
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