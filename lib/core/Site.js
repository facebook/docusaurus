const React = require('react');
const HeaderNav = require('./nav/HeaderNav.js');
const Head = require('./Head.js');
const Footer = require(process.cwd() + '/core/Footer.js');

class Site extends React.Component {  
  /*
  goes in body after navPusher

  <div id="fb-root" />
  <script
    type="text/javascript"
    src="https://cdn.jsdelivr.net/docsearch.js/1/docsearch.min.js"
  />
  <script
    dangerouslySetInnerHTML={{
      __html: `
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-44373548-17', 'auto');
    ga('send', 'pageview');

    !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)
    ){js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";
    fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");

    docsearch({
      apiKey: '833906d7486e4059359fa58823c4ef56',
      indexName: 'jest',
      inputSelector: '#search_input_react'
    });
  `,
    }}
  />
  <script async defer src="https://buttons.github.io/buttons.js" />
  */

  render() {
    const title = this.props.title
      ? this.props.title + ' · ' + this.props.config.title
      : this.props.config.title + ' · ' + this.props.config[this.props.language].tagline;
    const description =
      this.props.description || this.props.config[this.props.language].tagline;
    const url =
      this.props.config.url + this.props.config.baseUrl + (this.props.url || 'index.html');
    return (
      <html>
        <Head config={this.props.config} description={description} title={title} url={url} />
        <body className={this.props.className}>
          <HeaderNav
            config={this.props.config}
            baseUrl={this.props.config.baseUrl}
            section={this.props.section}
            title={this.props.config.title}
            language={this.props.language}
          />
          <div className="navPusher">
            {this.props.children}
            <Footer config={this.props.config} language={this.props.language} />
          </div>
        </body>
      </html>
    );
  }
}
module.exports = Site;