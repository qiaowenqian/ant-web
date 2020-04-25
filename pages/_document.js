import Document, { Head, Main, NextScript } from "next/document";
export default class extends Document {
  constructor() {
    super();
    this.state = {
      page:
        '<!--[if lte IE 9]><script >document.getElementById("body").removeChild(document.getElementById("body").children[0])</script><style type="text/css">body > div:nth-child(1){height:0;}body > div:nth-child(2){height: 100%;}#ie6-warning{width:100%;height:100%;background:#ffffe1;padding:5px 0;font-size:12px;text-align: center;}#ie6-warning p{width:960px;margin:0 auto;}</style><div id="ie6-warning"><p>本页面采用HTML5+CSS3，您正在使用老版本 Internet Explorer ，在本页面的显示效果可能有差异。建议您升级到 <a href="http://www.microsoft.com/china/windows/internet-explorer/" target="_blank">Internet Explorer 10</a> 或以下浏览器：<br><a href="http://www.mozillaonline.com/"><img src="img/Firefox.png" style="height: 80px;width: 80px;" >Firefox</a><a href="http://rj.baidu.com/soft/detail/11843.html?ald"><img src="img/google.png" style="height: 80px;width: 80px;">Chrome</a><a href="http://rj.baidu.com/soft/detail/12966.html?ald"><img src="img/safari.png" style="height: 80px;width: 80px;">Safari</a><a href="http://www.operachina.com/"><img src="img/china.png" style="height: 80px;width: 80px;">Opera</a></p></div><![endif]-->'
    };
  }

  render() {
    const { page } = this.state;
    return (
      <html>
        <Head>
          <title>蚂蚁分工</title>
          <meta charset="utf-8" />
          <meta http-equiv="X-UA-Compatible" content="chrome=1" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="renderer" content="webkit" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta
            name="keywords"
            content="蚂蚁，蚂蚁分工，协作软件，任务管理，项目管理，日程管理，文档管理，移动办公，云办公"
          />
          <meta
            name="description"
            content="蚂蚁分工是一款已分解和协同为基础，实现复杂项目的互联网协同与交易的协同办公软件"
          />
          <meta name="format-detection" content="telephone=no, email=no" />
          <meta
            name="viewport"
            content="width=device-width,height=device-height, user-scalable=no,initial-scale=1, minimum-scale=1, maximum-scale=1,target-densitydpi=device-dpi"
          />
          {/*logo图标*/}
          <link
            rel="shortcut icon"
            href="https://static.dingtalk.com/media/lALPBY0V4pWb8b_MyMzI_200_200.png"
            type="image/x-icon"
          />

          {/*公共样式*/}
          <link
            rel="stylesheet"
            type="text/css"
            id="J-theme-link"
            href="../static/react-static/pcvip/css/common.css?t=3.15.2"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="../static/react-static/pcvip/fonts/iconfont.css?t=3.15.2"
          />

          {/*antd样式*/}
          <link
            rel="stylesheet"
            href="../static/react-static/pcvip/css/antd.min.css?t=3.15.2"
          />

          {/*钉钉接口*/}
          <script src="https://g.alicdn.com/dingding/dingtalk-pc-api/2.7.0/index.js" />

          <link
            href="/static/react-static/pcvip/plusGantt/miniui/themes/default/miniui.css?t=3.0.5"
            rel="stylesheet"
            type="text/css"
          />
        </Head>
        <body id="body" style={{ margin: 0 }} ondragstart="return false">
          <Main style={{ height: "100%" }} />
          <NextScript />
          <div dangerouslySetInnerHTML={{ __html: page }} />
          <div id="file_img" />
        </body>

        {/* 阿里巴巴多色图标 */}
        <script src="https://at.alicdn.com/t/font_941116_agkj4yfwxuq.js" />
        {/* 钻石的 */}
        <script src="https://at.alicdn.com/t/font_899240_8jdk69z8ze8.js" />
        {/* 文件的 */}
        <script src="https://at.alicdn.com/t/font_941116_m81azptz6x.js" />

        {/*甘特图插件*/}
        <script
          defer
          src="/static/react-static/pcvip/plusGantt/jquery-1.8.1.min.js"
        />
        <script
          defer
          src="/static/react-static/pcvip/plusGantt/miniui/miniui.js"
        />
        <script
          defer
          src="/static/react-static/pcvip/plusGantt/plusgantt/GanttMenu.js"
        />
        <script
          defer
          src="/static/react-static/pcvip/plusGantt/plusgantt/GanttSchedule.js"
        />
        <script
          defer
          src="/static/react-static/pcvip/plusGantt/plusgantt/GanttService.js"
        />
        {/* <script defer src="/static/react-static/pcvip/dingDapan/index.js" /> */}

        <script src="https://gw.alipayobjects.com/os/antv/pkg/_antv.g2-3.4.1/dist/g2.min.js" />
        <script src="https://gw.alipayobjects.com/os/antv/assets/data-set/0.8.3/data-set.min.js" />
      </html>
    );
  }
}
