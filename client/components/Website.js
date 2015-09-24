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
    console.log('initLoadState');
    this.lastCommentId = -1;
    this.commentCount;
    this.host = undefined;
    this.path = undefined;
    this.textSearch = undefined;

    // for infinite scroll
    this.hasMoreComments = true;
    this.pendingAjax = false;
    this.query = {};
    this.paths = [];
    this.hosts = [];
  },

  componentDidMount: function() {
    this.initLoadState();

    // get all hosts from db for typeahead

    this.getAllHosts();
    // TODO: what do we want to show when we first land on this page?
  },

  getAllHosts: function() {
    var context = this;
    $.ajax({
      url: window.location.origin + '/api/gethosts',
      method: 'GET',
      dataType: 'json',
      success: function(data){
        this.hosts = data;
        this.addTypeahead(context);
      }.bind(this),

      error: function(xhr, status, err) {
        console.error(xhr, status, err.message);
      }
    });
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
          };
        });
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
      query.lastCommentId = this.lastCommentId;
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
    
    var query = {};
    
    this.lastCommentId = -1;

    query.host = this.refs.searchHost.getDOMNode().value;

    this.refs.searchHost.getDOMNode().value = '';
    
    this.query = query;
    this.host = query.host;

    this.getPaths(this.host);
    this.loadComments(query);  
  },

  addTypeahead: function(context){
    var getHost = function(url){
      var parser = document.createElement('a');
      parser.href = url;

      return parser.hostname;
    };

    var getPath = function(url){
      var parser = document.createElement('a');
      parser.href = url;

      return parser.path;
    };

    var hosts = context.hosts;
    var inputField = context.refs.searchHost;
    var substringMatcher = function(strs, context){

      return function findMatches(q, cb) {
        var input = inputField.getDOMNode().value;


        var matches, substringRegex;

        // an array that will be populated with substring matches
        matches = [];
        // regex used to determine if a string contains the substring `q`

        var filterRegex = /(https?:\/\/)?(www.)?([0-9A-Za-z\-_\.]*)(\/*)?/;
        
        var filtered = filterRegex.exec(input);
        
        input = filtered[3];
        
        var check = new RegExp('.*' + input.replace('.', '\\.') + '.*');

        // iterate through the pool of strings and for any string that
        // contains the substring and add it to the `matches` array
        $.each(strs, function(i, str) {
          if (check.test(str)) {
            matches.push(str);
          }
        });

        cb(matches);
      };
    }.bind(this);

    $('.host-typeahead').typeahead({
      hint: true,
      highlight: true,
      minLength: 1
    },
    {
      name: 'hosts',
      source: substringMatcher(hosts)
    });
  }.bind(this),

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
      <div className="container website-search">
        <div className="row">  
          <form className="col-xs-12 col-sm-3 col-md-4" onSubmit={this.hostSearch}>
            <div className="input-group">
              <input type="text" className="form-control host-typeahead" placeholder="Search for Website" ref="searchHost" />
              <div className="input-group-btn">
                  <button type="submit" className="btn btn-default btn-success">Search</button>
              </div>
            </div>
          </form>
        </div>
        

        {(() => {
          if (this.host){
            return (
              <div className="row"> 
                <div className="col-xs-12 col-sm-3 col-md-4">
                <form className="drill-down col-xs-12" onSubmit={this.urlTextSearch}>
                <h3>Finetune your search:</h3>
                    <div className="row">
                      <div className="form-group">
                        <input type="text" className="form-control" placeholder="Search by path" ref="searchPath" />
                      </div>
                    </div>
                    <div className="row">
                      <div className="form-group">
                        <input type="text" className="form-control" placeholder="Search for Comment Text" ref="textSearch" />
                      </div>
                    </div>
                    <div className="row">
                      <div className="form-group">
                      <button type="submit" className="btn btn-block">Drill down!</button>
                      </div>
                    </div>
                  </form>
                 
                </div>  
              <div className="col-xs-12 col-sm-9 col-md-8">
                <div className="search-results">
                Searching {this.host} 
               
               by: {this.path} 
               {this.textSearch} </div>   
                <div className="">
                  
                  <InfiniteScroll pageStart="0" loadMore={this.loadComments} hasMore={this.hasMoreComments && !this.pendingAjax}
                      loader={<div className="loader">Loading ...</div>}>
                    {comments}
                  </InfiniteScroll>
                </div>
              </div>
              </div>)
            }
          })()}  
      </div>
      </div>
    );
  }
});

module.exports = Website;
