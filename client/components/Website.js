var React = require('react');
var Comment = require('./Comment');
var InfiniteScroll = require('react-infinite-scroll')(React);


// At the moment, Website will only be used to display your personal
// Website, not that of others.
// 
// Load all the comments for this user into this.state.comments
// Need to store maxCommentId ... last comment in array id
// comments[length - 1].id
// 
var Website = React.createClass({
  getInitialState: function() {
    return {
      host: '',
      path: '',
      comments: [],
    };
  },

  // TODO: refactor to use to load additional comments too.
  initLoadState: function() {
    this.lastCommentId = undefined;
    
    // for infinite scroll
    this.hasMoreComments = true;

    this.currentQuery = {};
  },

  componentDidMount: function() {
    this.initLoadState();
    // TODO: what do we want to show when we first land on this page?
  },

  loadComments: function(searchObject){
    var query = searchObject;

    // always search by host
    query.host = searchObject.host || this.state.host

    // track our current search for infinite scroll
    for (var key in searchObject) {
      if (searchObject.hasOwnProperty(key)) {
        this.currentQuery[key] = searchObject[key];
      }
    }
    console.log(this.state.las)
    if (this.state.lastCommentId){
      query.lastCommentId = this.state.lastCommentId
    }

    console.log('websiteProfile loading comments:', query);
    $.ajax({
      url: window.location.origin + '/api/comments/get',
      data: query,
      method: 'GET',
      dataType: 'json',
      success: function(data){
        console.log('received comments:', data.comments);
        
        // check if we got the last batch of comments for this call
        if (data.comments.length < 25) {
          // TODO: when do we need to reset this to true?
          this.hasMoreComments = false;
          this.lastCommentId = 0;
        } else {
          this.lastCommentId = data.comments[data.comments.length - 1].id;
        }
        // add new comments so we render the page
        this.setState({comments: this.state.comments.concat(data.comments)});
      }.bind(this),

      error: function(xhr, status, err) {
        console.error(xhr, status, err.message);
      }
    })
  },

  // handle infinite scroll
  loadMoreComments: function () {
    this.loadComments(this.currentQuery);
  },
  
  // this is triggered when user searches by host 
  handleHostSearch: function(e){
    e.preventDefault();
    var host = this.refs.searchHost.getDOMNode().value;
    this.refs.searchHost.getDOMNode().value = '';

    this.loadComments({host: host});  
  },

  handlePathSearch: function(e){
    e.preventDefault();
    // var host = this.refs.searchHost;
    // this.refs.searchHost.getDOMNode().value;

    // this.loadComments({host: host});  
  },

  handleTextSearch: function(e){
    e.preventDefault();
    // var host = this.refs.searchHost;
    // this.refs.searchHost.getDOMNode().value;

    // this.loadComments({host: host});  
  },

  loadComments: function(){
    var query = {};


  },

  render: function() {
    var comments = this.state.comments.map(function(comment) {
      return <Comment key={comment.id} comment={comment} />;
    });

    return (
      <div className="row">
        <div className="col-md-4">
          <h2>{this.state.host}</h2>
          <p>Total Comments: {this.state.numComments}</p>
        </div>
        <div className="col-md-8">
          <div className="row">  
            <form onSubmit={this.handleHostSearch}>
              <div className="form-group col-sm-7">
                <input type="text" className="form-control" placeholder="Search for host" ref="searchHost" />
              </div>
              <div className="form-group col-sm-5">
                <button type="submit" className="btn btn-block btn-primary">Search</button>
              </div>
            </form>
          </div>
          <div className="row">
            <form onSubmit={this.handlePathSearch}>
              <div className="form-group col-sm-7">
                <input type="text" className="form-control" placeholder="Search by path" ref="searchPath" />
              </div>
              <div className="form-group col-sm-5">
                <button type="submit" className="btn btn-block btn-primary">Search</button>
              </div>
            </form>
          </div>          
          <div className="row">
            <form onSubmit={this.handleTextSearch}>
              <div className="form-group col-sm-7">
                <input type="text" className="form-control" placeholder="Search for Comment Text" ref="searchText" />
              </div>
              <div className="form-group col-sm-5">
                <button type="submit" className="btn btn-block btn-primary">Search</button>
              </div>
            </form>
          </div>
          <InfiniteScroll pageStart="0" loadMore={this.loadMoreComments} hasMore={this.hasMoreComments} 
              loader={<div className="loader">Loading ...</div>}>
            {comments}
          </InfiniteScroll>
        </div>
      </div>
    );
  }
});

module.exports = Website;
















        //   <div className="row">
        //     <form onSubmit={this.handlePathSearch}>
        //       <div className="form-group col-sm-7">
        //         <input type="text" className="form-control" placeholder="Search by path" ref="searchPath" />
        //       </div>
        //       <div className="form-group col-sm-5">
        //         <button type="submit" className="btn btn-block btn-primary">Search</button>
        //       </div>
        //     </form>
        //   </div>          
        //   <div className="row">
        //     <form onSubmit={this.handleTextSearch}>
        //       <div className="form-group col-sm-7">
        //         <input type="text" className="form-control" placeholder="Search for Comment Text" ref="searchText" />
        //       </div>
        //       <div className="form-group col-sm-5">
        //         <button type="submit" className="btn btn-block btn-primary">Search</button>
        //       </div>
        //     </form>
        //   </div>
        //   <InfiniteScroll pageStart="0" loadMore={this.loadMoreComments} hasMore={this.hasMoreComments} 
        //       loader={<div className="loader">Loading ...</div>}>
        //     {comments}
        //   </InfiniteScroll>
        // </div>