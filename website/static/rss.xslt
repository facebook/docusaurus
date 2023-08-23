<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">
  <html>
  <head>
    <title>Blog Information</title>
    <link rel="stylesheet" type="text/css" href="/styles.css" />
  </head>
  <body>
  <main class="markdown">
    <div class="description">
    <h1><xsl:value-of select="rss/channel/title"/></h1>
    <p>Description: <xsl:value-of select="rss/channel/description"/></p>
    <p>Last Build Date: <xsl:value-of select="substring(rss/channel/lastBuildDate,0,11)"/></p>
    <p>Language: <xsl:value-of select="rss/channel/language"/></p>
    </div>
    <h2>Recent Posts</h2>
    <ul class="postsList">
      <xsl:for-each select="rss/channel/item">
        <li>
          <a href="{link}">
            <xsl:value-of select="title"/>
          </a>
        </li>
      </xsl:for-each>
    </ul>
    </main>
  </body>
  </html>
</xsl:template>

</xsl:stylesheet>
