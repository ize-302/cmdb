import styled from "styled-components";

const bgdark = "#000212";
const itembg = "#1d2230";
const itemborder = "rgba(255, 255, 255, 0.05)";
const textcolor = "rgb(210, 211, 224)";

export const CmdbWrapper = styled.div`
  #cmdb {
    *,
    ::after,
    ::before {
      box-sizing: border-box;
      // remove highlights
      // -webkit-touch-callout: none; /* iOS Safari */
      // -webkit-user-select: none; /* Safari */
      // -khtml-user-select: none; /* Konqueror HTML */
      // -moz-user-select: none; /* Old versions of Firefox */
      // -ms-user-select: none; /* Internet Explorer/Edge */
      // user-select: none;
      letter-spacing: 0.3px;
      font-weight: 400;
      font-family: "Inter", sans-serif;
      font-size: 13px;
      line-height: 14px;
    }

    body {
      margin: 0;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    position: fixed;
    z-index: 9999;
    top: 0;
    left: 0;
    width: 100%;
    max-width: 100vw;
    height: 100vh;
    background-color: transparent;
    display: grid;
    place-items: center;
    overflow: hidden;
    font-family: "Inter" !important;
    text-align: left;
    line-height: 100%;
    color: ${textcolor};

    ::-webkit-scrollbar {
      width: 10px;
    }
    ::-webkit-scrollbar-track {
      background: ${bgdark};
    }
    ::-webkit-scrollbar-thumb {
      background: ${itembg};
      border: 1px solid ${itemborder};
    }
    ::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    /* http://meyerweb.com/eric/tools/css/reset/ 
   v2.0 | 20110126
   License: none (public domain)
*/
    // RESET STARTS HERE //
    // html,
    // body,
    // div,
    // span,
    // applet,
    // object,
    // iframe,
    // h1,
    // h2,
    // h3,
    // h4,
    // h5,
    // h6,
    // p,
    // blockquote,
    // pre,
    // a,
    // abbr,
    // acronym,
    // address,
    // big,
    // cite,
    // code,
    // del,
    // dfn,
    // em,
    // img,
    // ins,
    // kbd,
    // q,
    // s,
    // samp,
    // small,
    // strike,
    // strong,
    // sub,
    // sup,
    // tt,
    // var,
    // b,
    // u,
    // i,
    // center,
    // dl,
    // dt,
    // dd,
    // ol,
    // ul,
    // li,
    // fieldset,
    // form,
    // label,
    // legend,
    // table,
    // caption,
    // tbody,
    // tfoot,
    // thead,
    // tr,
    // th,
    // td,
    // article,
    // aside,
    // canvas,
    // details,
    // embed,
    // figure,
    // figcaption,
    // footer,
    // header,
    // hgroup,
    // menu,
    // nav,
    // output,
    // ruby,
    // section,
    // summary,
    // time,
    // mark,
    // audio,
    // video {
    //   margin: 0;
    //   padding: 0;
    //   border: 0;
    //   font-size: 100%;
    //   font: inherit;
    //   vertical-align: baseline;
    // }
    /* HTML5 display-role reset for older browsers */
    article,
    aside,
    details,
    figcaption,
    figure,
    footer,
    header,
    hgroup,
    menu,
    nav,
    section {
      display: block;
    }
    body {
      line-height: 1;
    }
    ol,
    ul,
    li {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    blockquote,
    q {
      quotes: none;
    }
    blockquote:before,
    blockquote:after,
    q:before,
    q:after {
      content: "";
      content: none;
    }
    table {
      border-collapse: collapse;
      border-spacing: 0;
    }

    button,
    input {
      background: none;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      border: none;
    }
    // RESET ENDS HERE //

    //buttons
    button {
      padding: 5px 10px;
      border-radius: 4px;
      cursor: pointer;
      &.cmdb-primary {
        background-color: white;
        color: #333;
      }
      &.cmdb-secondary {
        background-color: transparent;
        color: white;
      }
    }

    // inputs
    input {
      width: 100%;
      border: none;
      border-radius: 4px;
      padding: 4px 8px;
      height: 26px;
      &.cmdb-input {
        background-color: rgba(0, 0, 0, 0.606);
        position: relative;
        color: white;
        margin-bottom: 10px;
        &:focus {
          outline: none !important;
        }
      }
    }
    // select
    select {
      width: 100%;
      border: none;
      border-radius: 4px;
      padding: 4px 8px;
      height: 26px;
      &.cmdb-select {
        background-color: rgba(0, 0, 0, 0.606);
        position: relative;
        color: white;
        margin-bottom: 10px;
        &:focus {
          outline: none !important;
        }
      }
    }
    label {
      &.cmdb-label {
        margin-bottom: 3px;
        display: block;
        color: rgba(255, 255, 255, 0.443);
      }
    }

    .react-tooltip {
      color: white;
      background-color: ${itembg};
      padding: 5px 10px;
    }

    // keyframes
    @keyframes rotate {
      100% {
        transform: rotate(360deg);
      }
    }

    @keyframes fadein {
      0% {
        opacity: 0;
        transform: scale(0.5);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }

    @keyframes fadeout {
      0% {
        opacity: 1;
        transform: scale(1);
      }
      100% {
        opacity: 0;
        transform: scale(0.5);
      }
    }

    @keyframes itemsappear {
      0% {
        opacity: 0;
        left: -40px;
      }
      100% {
        opacity: 1;
        left: 0;
      }
    }

    @keyframes SlideIn {
      0% {
        opacity: 0;
        bottom: -10px;
      }
      100% {
        bottom: 0;
      }
    }

    .cmdb-dropshadow {
      position: fixed;
      top: 0;
      width: 50vw;
      height: 100%;
      opacity: 0.4;
      background: conic-gradient(
        from 230.29deg at 51.63% 52.16%,
        rgb(36, 0, 255) 0deg,
        rgb(0, 135, 255) 67.5deg,
        rgb(108, 39, 157) 198.75deg,
        rgb(24, 38, 163) 251.25deg,
        rgb(54, 103, 196) 301.88deg,
        rgb(105, 30, 255) 360deg
      );
      filter: blur(160px);
      transform: translateZ(0px);
      overflow: hidden;
    }

    .cmdb-animated-bg {
      position: relative;
      z-index: 0;
      max-width: 970px;
      width: 90vw;
      max-height: calc(100vh - 120px);
      height: 100%;
      border-radius: 10px;
      overflow: hidden;
      padding: 1px;

      &::before {
        content: "";
        position: absolute;
        z-index: -2;
        left: -50%;
        top: -50%;
        width: 200%;
        height: 200%;
        animation: rotate 20s linear infinite;
        background-color: #1a232a;
        background-repeat: no-repeat;
        background-position: 0 0;
        background-image: conic-gradient(
          transparent,
          rgba(255, 255, 255, 0.4),
          transparent 30%
        );
      }

      &::after {
        content: "";
        left: -50%;
        top: -50%;
        width: 200%;
        height: 200%;
        position: absolute;
        z-index: -2;
        background-image: linear-gradient(
          to bottom,
          rgba(95, 106, 210, 0.2),
          transparent
        );
      }
    }

    .cmdb-container {
      height: 100%;
      width: 100%;
    }

    .cmdb-show {
      animation-name: fadein;
      animation-duration: 0.1s;
      animation-timing-function: ease-out;
      animation-delay: 0;
      animation-direction: alternate;
      animation-iteration-count: 1;
      animation-fill-mode: both;
      animation-play-state: running;
      transition: all;
    }

    .cmdb-hide {
      animation-name: fadeout;
      animation-duration: 0.3s;
      animation-timing-function: ease-out;
      animation-delay: 0;
      animation-direction: alternate;
      animation-iteration-count: 1;
      animation-fill-mode: both;
      animation-play-state: running;
      transition: all;
    }

    // top nav starts here
    .cmdb-topnav {
      background-color: rgba(0, 0, 0, 0.513);
      border-top-right-radius: 9px;
      border-top-left-radius: 9px;
      margin-bottom: 1px;
      padding: 5px 20px;
      letter-spacing: 1px;
      color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      // position: relative;
      // z-index: 100;
      // top: 0;
      // left: 0;
      .cmdb-topnav-item {
        width: 30%;
        display: flex;
        align-items: center;

        .cmdb-logo {
          font-weight: 400;
          color: white;
          gap: 3px;
        }
        .cmdb-version {
          margin-left: 2px;
          font-size: 10px;
          color: #bbb;
          position: relative;
        }

        &_right {
          justify-content: flex-end;
          gap: 24px;
          .cmdb-topnav-item_right-save-url {
            background-color: #000;
            color: #000;
            border-radius: 4px;
            padding: 10px 5px;
            justify-content: center;
            gap: 4px;
            display: flex;
            max-width: 30px;
            align-items: center;
          }
        }
      }
      button {
        padding: 0;
        border: none;
        max-height: 16px;
        min-height: 16px;
      }
      input#cmdb-search {
        background-color: ${bgdark};
        border: none;
        border-radius: 4px;
        width: 300px;
        padding: 4px 8px;
        height: 26px;
        position: relative;
        color: white;
        &:focus {
          outline: none !important;
        }
      }
      &::-webkit-input-placeholder {
        color: ${itembg};
      }
    }

    /* body starts here  */
    .cmdb-body {
      display: flex;
      height: calc(100vh - 159px);

      // side nav
      .cmdb-sidenav {
        margin-right: 1px;
        background: ${bgdark};
        min-width: 240px;
        padding: 0px 10px;
        overflow-y: auto;
        border-bottom-left-radius: 9px;
        &_greetings {
          color: white;
          margin: 20px 0 10px 10px;

          outline: none;
          font-weight: 400;
          opacity: 0.4;
        }
        &_go-back {
          color: white;
          margin: 20px 0 40px 6px;

          display: flex;
          align-items: center;
          gap: 5px;
          outline: none;
          font-weight: 400;
          cursor: pointer;
          opacity: 0.4;
          &:focus {
            outline: none;
          }
          &:hover {
            opacity: 0.6;
          }
        }
        &-items {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-top: 20px;
          animation-name: itemsappear;
          animation-duration: 0.4s;
          animation-timing-function: ease-out;
          animation-delay: 0;
          animation-direction: alternate;
          animation-iteration-count: 1;
          animation-fill-mode: both;
          animation-play-state: running;
          transition: all;
          opacity: 0;
          position: relative;

          .cmdb-currentfolder-name {
            margin-bottom: 5px;
            margin-left: 10px;
            color: ${textcolor};
            opacity: 0.4;
          }
          .cmdb-sidenav-item {
            cursor: pointer;
            padding: 10px;
            border-radius: 4px;
            color: ${textcolor};

            display: flex;
            gap: 10px;
            align-items: center;
            transition-duration: 0.3s;
            &:hover {
              background: ${itembg};
              svg {
                color: white;
                opacity: 1;
              }
            }
          }
          input[type="radio"] {
            display: none;
          }
          input[type="radio"]:checked + label {
            background: ${itembg};
            border-width: 1px;
            border-style: solid;
            border-color: ${itemborder};
            color: white;
            svg {
              opacity: 1;
            }
          }
        }
      }
    }

    .cmdb-content-section {
      overflow-y: auto;
      overflow-x: hidden;
      width: 100%;
      position: relative;
      background: ${bgdark};
      border-bottom-right-radius: 9px;

      .cmdb-empty-page {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 10px;

        place-items: center;
        height: 100%;
        text-align: center;
        color: ${textcolor};
        margin-top: 100px;
      }

      .cmdb-list {
        padding: 18px 10px 20px 10px;

        display: flex;
        flex-direction: column;
        gap: 4px;

        .cmdb-page-heading {
          border-bottom: 1px solid ${itemborder};
          padding: 0 10px 10px 10px;
          margin-bottom: 4px;
          display: flex;
          justify-content: space-between;

          .cmdb-page-title {
            color: white;
          }

          button {
            color: red;
          }
        }

        @for $i from 1 through 40 {
          .cmdb-list-item:nth-child(#{$i}n) {
            animation-delay: #{$i * 0.05}s;
          }
        }

        .cmdb-list-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          animation: SlideIn 0.3s linear forwards;
          animation-fill-mode: both;
          position: relative;
          padding: 6px 12px;
          border-radius: 4px;
          &:hover {
            background: ${itembg};
            .cmdb-list-item_title {
              color: white;
              cursor: pointer;
            }
          }
          .cmdb-list-item_title {
            overflow: hidden;
            transition-duration: 0.3s;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 630px;
            display: flex;
            gap: 10px;
            color: ${textcolor};
          }
        }
        input[type="checkbox"] {
          display: none;
        }
        input[type="checkbox"]:checked + label {
          background: ${itembg};
          border-width: 1px;
          border-style: solid;
          border-color: ${itemborder};
          position: relative;
        }

        .cmdb-list-item_kebab {
          cursor: pointer;
          min-width: 30px;
          min-height: 30px;
          padding-top: 1px;
          border-radius: 100%;
          display: grid;
          place-items: center;
          &:hover {
            background: #ececec11;
          }
        }

        .cmdb-menu {
          min-width: 150px;
          border-radius: 4px;
          background: #1d2230;
          border-width: 1px;
          border-style: solid;
          border-color: ${itemborder};
          position: absolute;
          top: 4px;
          right: 10px;
          z-index: 4;

          .cmdb-menu-item {
            border-bottom: 1px solid ${itemborder};
            padding: 8px 12px;
            color: ${textcolor};

            margin: 0;
            &.delete {
              color: red;
            }
            &:hover {
              cursor: pointer;
              opacity: 0.7;
            }
            &:last-child {
              border: none;
            }
          }
        }
      }
      .cmdb-content-actions {
        position: sticky;
        bottom: 10px;
        background-color: #439dfc;
        height: 40px;
        border-radius: 4px;
        width: 97%;
        margin: 0 1.5%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.302);
        padding: 0 15px;

        color: #000;

        &-controls {
          display: flex;
          align-items: center;
          .delete {
            color: red;
            cursor: pointer;
          }
        }
      }
    }

    //
    .cmdb-modal {
      position: fixed;
      height: 100%;
      width: 100%;
      top: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      .cmdb-modal-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.473);
        width: 100%;
        height: 100%;
      }
      .cmdb-modal-content {
        position: relative;
        z-index: 1;
        background: ${itembg};
        width: 350px;
        border-radius: 4px;
        border: 1px solid ${itemborder};
        box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.302);
        padding: 15px;
        animation-name: fadein;
        animation-duration: 0.1s;
        animation-timing-function: ease-out;
        animation-delay: 0;
        animation-direction: alternate;
        animation-iteration-count: 1;
        animation-fill-mode: both;
        animation-play-state: running;
        transition: all;

        .cmdb-modal-title {
          margin-bottom: 15px;
        }

        .cmdb-modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 10px;
        }
      }
    }
  }
`;
