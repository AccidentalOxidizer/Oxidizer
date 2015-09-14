var React = require('react');
var Comment = require('./Comment');
var Path = require('./Path');
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
      comments: [],
      paths: []
    };
  },

  // TODO: refactor to use to load additional comments too.
  initLoadState: function() {
    this.lastCommentId = -1;
    this.commentCount;
    this.host = undefined;
    this.path = undefined;
    this.textSearch = undefined;

    // for infinite scroll
    this.hasMoreComments = true;
    this.pendingAjax = false;
    this.query = {};
  },

  componentDidMount: function() {
    this.initLoadState();
    // TODO: what do we want to show when we first land on this page?
  },

  getPaths: function(host){
    $.ajax({
      url: window.location.origin + '/api/url/path',
      data: {host: host},
      method: 'GET',
      dataType: 'json',
      success: function(data){
        console.log('recieved paths');
        data = data.map(function(url){
          return {
            url: url.url,
            commentCount: url.Comments[0].count
          }
        });

        // this.setState({paths: data});
      }.bind(this),

      error: function(xhr, status, err) {
        console.error(xhr, status, err.message);
      }
    });
  },

  loadComments: function(searchObject){

    var query = {};
    // always search by host
    query.host = searchObject.host || this.host;
    query.urlSearch = searchObject.urlSearch || this.path;
    query.textSearch = searchObject.textSearch || this.textSearch;
    
    if (this.lastCommentId > -1) {
      query.lastCommentId = this.lastCommentId
    }

    console.log('websiteProfile loading comments:', query);
    this.pendingAjax = true;
    $.ajax({
      url: window.location.origin + '/api/comments',
      data: query,
      method: 'GET',
      dataType: 'json',
      success: function(data){
        console.log('received comments:', data);
        console.log('received userInfo:', data.userInfo);
        this.pendingAjax = false;
        
        var updatedComments; 
        if (this.lastCommentId === -1) {  
          updatedComments = data.comments;
        } else {
          updatedComments = this.state.comments.concat(data.comments);
        }

        // add new comments so we render the page
        if (data.comments.length < 25) {
          // TODO: when do we need to reset this to true?
          this.hasMoreComments = false;
          this.lastCommentId = 0;
        } else {
          this.lastCommentId = data.comments[data.comments.length - 1].id;
        }
        this.count = data.numComments;
        this.setState({comments: updatedComments});
      }.bind(this),

      error: function(xhr, status, err) {
        console.error(xhr, status, err.message);
      }
    });
  },
  
  // this is triggered when user searches by host 
  urlTextSearch: function(e){
    e.preventDefault();
    
    var query = {};
    var urlSearch = this.refs.searchPath.getDOMNode().value;
    var textSearch = this.refs.textSearch.getDOMNode().value;

    this.lastCommentId = -1;

    query.host = this.host;
    
    if (urlSearch !== '') {
      query.urlSearch = urlSearch;
    }    
    if (textSearch !== '') {
      query.textSearch = textSearch;
    }
    
    this.query = query;

    this.loadComments(query);  
  },

  hostSearch: function(e){
    e.preventDefault();
    console.log('hostSearch');
    var query = {};
    
    this.lastCommentId = -1;

    query.host = this.refs.searchHost.getDOMNode().value;

    this.refs.searchHost.getDOMNode().value = '';
    
    this.query = query;
    this.host = query.host;

    this.getPaths(this.host);
    this.loadComments(query);  
  },

  urlLink: function(){
    console.log('happening');
  },

  render: function() {
    var comments = this.state.comments.map(function(comment) {
      return <Comment key={comment.id} comment={comment} />;
    });

    var handler = this.urlLink;

    var paths = this.state.paths.map(function(path) {
      return <Path key={path.url} path={path} redirect={handler} />;
    });

    return (
      <div>
        <div className="row">  
          <form onSubmit={this.hostSearch}>
            <input type="text" className="col-md-8 form-control" placeholder="Search for host" ref="searchHost" />
            <button type="submit" className="col-md-4 btn btn-block btn-primary">Search</button>
          </form>
        </div>

        <div className="col-md-4">
          <h2>{this.host}</h2>
          <p>Total Comments: {this.count}</p>
          <div>{paths}</div>
        </div>  

        {(() => {
          if (this.host){
            return (
              <div className="col-md-8">
                <div className="row">Searching by: {this.path} {this.textSearch}</div>   
                <div className="col-md-8">
                  <form onSubmit={this.urlTextSearch}>
                    <div className="row">
                      <div className="form-group col-sm-7">
                        <input type="text" className="form-control" placeholder="Search by path" ref="searchPath" />
                      </div>
                    </div>
                    <div className="row">
                      <div className="form-group col-sm-7">
                        <input type="text" className="form-control" placeholder="Search for Comment Text" ref="textSearch" />
                      </div>
                    </div>
                    <div className="row">
                      <button type="submit" className="btn btn-block btn-primary">Search</button>
                    </div>
                  </form>
                  <InfiniteScroll pageStart="0" loadMore={this.loadComments} hasMore={this.hasMoreComments && !this.pendingAjax}
                      loader={<div className="loader">Loading ...</div>}>
                    {comments}
                  </InfiniteScroll>
                </div>
              </div>)
            }
          })()}  
      </div>

    );
  }
});

module.exports = Website;
