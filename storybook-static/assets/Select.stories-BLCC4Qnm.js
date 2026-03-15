import{j as e}from"./jsx-runtime-u17CrQMm.js";import{r as n}from"./iframe-g5PiM8Jh.js";import{c as p}from"./cn-C8nBGPD0.js";import{r as V}from"./resolveIcon-B4eesLNI.js";import{I as U}from"./Icon-CxPrjGB-.js";import{A as O}from"./Avatar-BvmkuJdv.js";import"./preload-helper-PPVm8Dsz.js";const H=n.createContext(null);function M(){const o=n.useContext(H);if(!o)throw new Error("SelectOption must be used within <Select>");return o}function Q(o,m){let c=null;return n.Children.forEach(o,i=>{c||n.isValidElement(i)&&i.props.value===m&&(c={label:i.props.children,icon:i.props.icon,avatar:i.props.avatar,statusColor:i.props.statusColor,description:i.props.description})}),c}const s=n.forwardRef(({value:o,defaultValue:m="",onValueChange:c,placeholder:i="Select an option",label:b,helperText:d,disabled:h=!1,children:S,className:I,wrapperClassName:E,...B},v)=>{const[k,R]=n.useState(m),[t,g]=n.useState(!1),x=o??k,W=n.useRef(null),F=n.useRef(null),y=n.useRef(null),_=n.useCallback(l=>{o===void 0&&R(l),c?.(l),g(!1),setTimeout(()=>F.current?.focus(),0)},[o,c]);n.useEffect(()=>{if(!t)return;const l=r=>{W.current&&!W.current.contains(r.target)&&g(!1)};return document.addEventListener("mousedown",l),()=>document.removeEventListener("mousedown",l)},[t]),n.useEffect(()=>{if(!t)return;const l=r=>{r.key==="Escape"&&(g(!1),F.current?.focus())};return document.addEventListener("keydown",l),()=>document.removeEventListener("keydown",l)},[t]),n.useEffect(()=>{if(!t)return;const l=setTimeout(()=>{const r=y.current?.querySelector('[role="option"][aria-selected="true"]'),f=y.current?.querySelector('[role="option"]:not([disabled])');(r??f)?.focus()},0);return()=>clearTimeout(l)},[t]);const J=l=>{const r=Array.from(y.current?.querySelectorAll('[role="option"]:not([disabled])')??[]);if(!r.length)return;const f=r.findIndex(w=>w===document.activeElement);switch(l.key){case"ArrowDown":{l.preventDefault();const w=f<r.length-1?f+1:0;r[w]?.focus();break}case"ArrowUp":{l.preventDefault();const w=f>0?f-1:r.length-1;r[w]?.focus();break}case"Home":{l.preventDefault(),r[0]?.focus();break}case"End":{l.preventDefault(),r[r.length-1]?.focus();break}}},u=x?Q(S,x):null,K=u?u.avatar?u.avatar:u.statusColor?e.jsx("span",{className:"shrink-0 size-2 rounded-full border-[1.5px] border-white",style:{backgroundColor:u.statusColor}}):u.icon?e.jsx("span",{className:"shrink-0 size-5",children:V(u.icon,"md")}):null:null;return e.jsxs("div",{ref:l=>{W.current=l,typeof v=="function"?v(l):v&&(v.current=l)},className:p("relative flex flex-col gap-2 w-full",E),...B,children:[b&&e.jsx("label",{className:"text-sm font-medium text-grey-900 leading-[1.45]",children:b}),e.jsxs("button",{ref:F,type:"button",role:"combobox","aria-expanded":t,"aria-haspopup":"listbox",disabled:h,onClick:()=>!h&&g(!t),className:p("flex h-14 w-full items-center gap-3 rounded-md border px-4 transition-colors",h?"bg-grey-100 border-grey-300 cursor-not-allowed":t?"bg-white border-[#1671D9]":"bg-white border-grey-300 hover:border-[#B6D8FF]",I),children:[e.jsxs("div",{className:"flex flex-1 items-center gap-2 min-w-0",children:[K,e.jsx("span",{className:p("truncate text-body-sm",u?"text-grey-900":"text-grey-400"),children:u?u.label:i})]}),e.jsx(U,{name:"chevron-down",size:"md",className:p("shrink-0 transition-transform",t&&"rotate-180",h?"text-grey-300":"text-grey-500")})]}),d&&e.jsx("p",{className:"text-sm text-grey-500 leading-[1.45]",children:d}),t&&e.jsx(H.Provider,{value:{value:x,onSelect:_,open:t},children:e.jsx("div",{ref:y,role:"listbox",onKeyDown:J,className:"absolute left-0 right-0 top-full z-50 mt-2 max-h-[320px] overflow-y-auto rounded-lg border border-grey-200 bg-white py-1 shadow-[0px_3px_2px_-2px_rgba(0,0,0,0.06),0px_5px_3px_-2px_rgba(0,0,0,0.02)]",children:S})})]})});s.displayName="Select";s.__docgenInfo={description:"",methods:[],displayName:"Select",props:{value:{required:!1,tsType:{name:"string"},description:"Controlled value"},defaultValue:{required:!1,tsType:{name:"string"},description:"Uncontrolled default value",defaultValue:{value:'""',computed:!1}},onValueChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: string) => void",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"void"}}},description:"Called when value changes"},placeholder:{required:!1,tsType:{name:"string"},description:"Placeholder text when no value is selected",defaultValue:{value:'"Select an option"',computed:!1}},label:{required:!1,tsType:{name:"string"},description:"Label text above the select"},helperText:{required:!1,tsType:{name:"string"},description:"Helper text below the select"},disabled:{required:!1,tsType:{name:"boolean"},description:"Whether the select is disabled",defaultValue:{value:"false",computed:!1}},wrapperClassName:{required:!1,tsType:{name:"string"},description:"Wrapper className for the outermost div"},children:{required:!0,tsType:{name:"ReactNode"},description:""}},composes:["Omit"]};const a=n.forwardRef(({value:o,icon:m,avatar:c,statusColor:i,description:b,disabled:d=!1,children:h,className:S,onClick:I,...E},B)=>{const v=M(),k=v.value===o,R=x=>{d||(I?.(x),v.onSelect(o))},t=V(m,"md"),g=c?e.jsx("span",{className:"shrink-0 size-5",children:c}):i?e.jsx("span",{className:"shrink-0 size-2 rounded-full border-[1.5px] border-white",style:{backgroundColor:i}}):t?e.jsx("span",{className:p("shrink-0 size-5",d&&"opacity-50"),children:t}):null;return e.jsxs("button",{ref:B,type:"button",role:"option",tabIndex:-1,"aria-selected":k,disabled:d,onClick:R,className:p("flex w-full items-center px-4 py-2 text-left text-body-sm outline-none transition-colors",i?"gap-2":"gap-3",d?"bg-grey-100 text-grey-400 cursor-not-allowed":"text-grey-900 hover:bg-grey-50 focus:bg-grey-100 focus:font-medium",S),...E,children:[e.jsxs("div",{className:p("flex flex-1 items-center",i?"gap-2":"gap-3"),children:[g,e.jsx("span",{className:"shrink-0",children:h}),b&&e.jsx("span",{className:"text-grey-500 truncate",children:b})]}),k&&!d&&e.jsx("span",{className:"ml-2 shrink-0",children:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",className:"text-[#1671D9]",children:[e.jsx("circle",{cx:"8",cy:"8",r:"8",fill:"currentColor"}),e.jsx("path",{d:"M11.5 5.5L6.5 10.5L4.5 8.5",stroke:"white",strokeWidth:1.5,strokeLinecap:"round",strokeLinejoin:"round"})]})})]})});a.displayName="SelectOption";a.__docgenInfo={description:"",methods:[],displayName:"SelectOption",props:{value:{required:!0,tsType:{name:"string"},description:"Unique value for this option"},icon:{required:!1,tsType:{name:"union",raw:"ReactNode | IconName",elements:[{name:"ReactNode"},{name:"union",raw:`"3d"
| "AI-stars"
| "AR"
| "BTC"
| "ETH"
| "NFT"
| "NFT-add"
| "NFT-profile"
| "NFT-remove"
| "QR-code"
| "VR-goggles"
| "airplane"
| "airpod"
| "alarm-clock"
| "align-center"
| "align-justify"
| "align-left"
| "align-right"
| "arrow-down"
| "arrow-down-left"
| "arrow-down-right"
| "arrow-expand"
| "arrow-left"
| "arrow-right"
| "arrow-shrink"
| "arrow-up"
| "arrow-up-left"
| "arrow-up-right"
| "arrow-up-split"
| "at"
| "backward"
| "badge"
| "bag"
| "ball"
| "bank"
| "bar-chart-h"
| "bar-chart-v"
| "battery"
| "battery-charging"
| "battery-empty"
| "bed"
| "beizer-curve"
| "bell"
| "bell-slash"
| "bicycle"
| "bin"
| "bluetooth"
| "bold"
| "book"
| "book-open"
| "bookmark"
| "bookmark-add"
| "bookmarks"
| "books"
| "bot"
| "box"
| "box-1"
| "branch"
| "brush"
| "bug"
| "building-1"
| "building-2"
| "building-3"
| "building-4"
| "building-5"
| "building-6"
| "bulb"
| "bulb-slash"
| "bus"
| "calendar"
| "calendar-add"
| "calendar-alt"
| "calendar-cross"
| "calendar-remove"
| "calendar-tick"
| "call"
| "call-add"
| "call-cross"
| "call-incoming"
| "call-outgoing"
| "call-remove"
| "call-ringing"
| "camera"
| "camera-slash"
| "candles-h"
| "candles-v"
| "car"
| "card"
| "card-add"
| "card-cross"
| "card-fund"
| "card-in"
| "card-out"
| "card-remove"
| "card-tick"
| "card-withdraw"
| "cart"
| "cart-add"
| "cart-check"
| "cart-cross"
| "cart-minus"
| "chart"
| "chart-down"
| "chart-up"
| "chat"
| "chat-alt"
| "chats"
| "check"
| "check-circle"
| "checkbox"
| "checkbox-checked"
| "chevron-down"
| "chevron-h"
| "chevron-left"
| "chevron-right"
| "chevron-up"
| "chevron-v"
| "clipboard"
| "clock"
| "cloud"
| "cloud-1"
| "cloud-download"
| "cloud-info"
| "cloud-lightning"
| "cloud-rain"
| "cloud-slash"
| "cloud-snowy"
| "cloud-upload"
| "clouds"
| "code"
| "code-2"
| "coin-stack"
| "coin-swap"
| "coins"
| "coins-alt"
| "color-picker"
| "column"
| "compass"
| "conical-flask"
| "copy"
| "corner"
| "corner-down-left"
| "corner-down-right"
| "corner-left-down"
| "corner-left-up"
| "corner-right-down"
| "corner-right-up"
| "corner-up-left"
| "corner-up-right"
| "crop"
| "cup"
| "cursor"
| "data"
| "devices"
| "dislike"
| "division"
| "dollar"
| "dots-h"
| "dots-h-circle"
| "dots-v"
| "dots-v-circle"
| "download"
| "elements"
| "emoji"
| "emoji-add"
| "euro"
| "expand"
| "eye"
| "eye-slash"
| "face-id"
| "feather"
| "feather-AI"
| "feather-add"
| "file"
| "file-alt"
| "file-cloud"
| "file-code"
| "file-download"
| "file-upload"
| "filter"
| "filter-alt"
| "fingerprint"
| "first-aid"
| "flag"
| "flower"
| "folder"
| "folder-add"
| "folder-cloud"
| "folder-cross"
| "folder-download"
| "folder-lock"
| "folder-move"
| "folder-shield"
| "folder-upload"
| "folder-user"
| "fork"
| "forward"
| "game-pad"
| "gear-AI"
| "gem"
| "gift"
| "globe"
| "globe-alt"
| "gps"
| "graduating cap"
| "grid"
| "grid-2"
| "hashtag"
| "heading"
| "headphones"
| "headset"
| "health-plus"
| "heart"
| "heart-beat"
| "heart-beat-wave"
| "history"
| "home"
| "home-alt"
| "image"
| "image-add"
| "image-check"
| "image-circle"
| "image-cross"
| "image-remove"
| "info-circle"
| "info-hexagon"
| "info-triangle"
| "italics"
| "key"
| "keyboard"
| "lamp"
| "laptop"
| "layer"
| "lifebuoy"
| "lightning"
| "lightning-off"
| "like"
| "line-height"
| "link"
| "link-detach"
| "list"
| "list-add"
| "lock"
| "lock-open"
| "loudspeaker"
| "magic-wand"
| "mail"
| "mail-add"
| "mail-check"
| "mail-cross"
| "mail-remove"
| "map"
| "map-alt"
| "map-marker"
| "media"
| "merge"
| "message"
| "message-alt"
| "messages"
| "microphone"
| "microphone-slash"
| "minus"
| "minus-circle"
| "mobile"
| "money"
| "money-1"
| "money-2"
| "moon"
| "moon-cloud"
| "moon-stars"
| "mouse"
| "move"
| "multiply"
| "multiply-circle"
| "music"
| "music-AI"
| "music-note"
| "naira"
| "navigation"
| "navigation-alt"
| "newspaper"
| "next"
| "paint-brush"
| "paint-bucket"
| "palette"
| "paper-clip"
| "paragraph-spacing"
| "pause"
| "pc"
| "pc-lock"
| "pc-speaker"
| "pc-user"
| "pencil"
| "pencil-edit"
| "pie-chart"
| "pin"
| "pin-alt"
| "plant"
| "plant-2"
| "play"
| "playlist"
| "plus"
| "plus-circle"
| "pounds"
| "power"
| "previous"
| "printer"
| "processor"
| "pull-request"
| "question-circle"
| "quote"
| "radio-button"
| "radio-selected"
| "receipt"
| "redo"
| "refresh"
| "repeat"
| "repeat-once"
| "road-sign"
| "rocket"
| "rocket-alt"
| "rotate-left"
| "rotate-right"
| "route"
| "row"
| "save"
| "scan"
| "scissor"
| "screenshot"
| "search"
| "send"
| "send-AI"
| "send-alt"
| "server"
| "server-alt"
| "settings"
| "settings-1"
| "settings-2"
| "share"
| "share-alt"
| "shield"
| "shield-cross"
| "shield-tick"
| "ship"
| "shower"
| "shrink"
| "shrink-alt"
| "shuffle"
| "sign-in"
| "sign-out"
| "signal"
| "signal-off"
| "sim"
| "snooze"
| "snowflake"
| "sofa"
| "speaker"
| "star"
| "stars"
| "stop"
| "stopwatch"
| "store"
| "strikethrough"
| "subscript"
| "suitcase"
| "sun"
| "sun-cloud"
| "superscript"
| "support"
| "switch-diagonal"
| "switch-horizontal"
| "switch-vertical"
| "tablet"
| "target"
| "taxi"
| "terminal"
| "text"
| "thermometer"
| "ticket"
| "tissue"
| "train"
| "trophy"
| "truck"
| "tv"
| "underline"
| "undo"
| "upload"
| "user"
| "user-add"
| "user-circle"
| "user-cross"
| "user-group"
| "user-heart"
| "user-remove"
| "user-tick"
| "users"
| "verified"
| "video"
| "video-slash"
| "voice-note"
| "volume"
| "volume-low"
| "volume-mute"
| "volume-slash"
| "wallet"
| "wallet-add"
| "wallet-check"
| "wallet-cross"
| "wallet-fund"
| "wallet-remove"
| "wallet-withdraw"
| "water-drop"
| "wifi"
| "wristwatch"
| "yen"
| "zoom-in"
| "zoom-out"`,elements:[{name:"literal",value:'"3d"'},{name:"literal",value:'"AI-stars"'},{name:"literal",value:'"AR"'},{name:"literal",value:'"BTC"'},{name:"literal",value:'"ETH"'},{name:"literal",value:'"NFT"'},{name:"literal",value:'"NFT-add"'},{name:"literal",value:'"NFT-profile"'},{name:"literal",value:'"NFT-remove"'},{name:"literal",value:'"QR-code"'},{name:"literal",value:'"VR-goggles"'},{name:"literal",value:'"airplane"'},{name:"literal",value:'"airpod"'},{name:"literal",value:'"alarm-clock"'},{name:"literal",value:'"align-center"'},{name:"literal",value:'"align-justify"'},{name:"literal",value:'"align-left"'},{name:"literal",value:'"align-right"'},{name:"literal",value:'"arrow-down"'},{name:"literal",value:'"arrow-down-left"'},{name:"literal",value:'"arrow-down-right"'},{name:"literal",value:'"arrow-expand"'},{name:"literal",value:'"arrow-left"'},{name:"literal",value:'"arrow-right"'},{name:"literal",value:'"arrow-shrink"'},{name:"literal",value:'"arrow-up"'},{name:"literal",value:'"arrow-up-left"'},{name:"literal",value:'"arrow-up-right"'},{name:"literal",value:'"arrow-up-split"'},{name:"literal",value:'"at"'},{name:"literal",value:'"backward"'},{name:"literal",value:'"badge"'},{name:"literal",value:'"bag"'},{name:"literal",value:'"ball"'},{name:"literal",value:'"bank"'},{name:"literal",value:'"bar-chart-h"'},{name:"literal",value:'"bar-chart-v"'},{name:"literal",value:'"battery"'},{name:"literal",value:'"battery-charging"'},{name:"literal",value:'"battery-empty"'},{name:"literal",value:'"bed"'},{name:"literal",value:'"beizer-curve"'},{name:"literal",value:'"bell"'},{name:"literal",value:'"bell-slash"'},{name:"literal",value:'"bicycle"'},{name:"literal",value:'"bin"'},{name:"literal",value:'"bluetooth"'},{name:"literal",value:'"bold"'},{name:"literal",value:'"book"'},{name:"literal",value:'"book-open"'},{name:"literal",value:'"bookmark"'},{name:"literal",value:'"bookmark-add"'},{name:"literal",value:'"bookmarks"'},{name:"literal",value:'"books"'},{name:"literal",value:'"bot"'},{name:"literal",value:'"box"'},{name:"literal",value:'"box-1"'},{name:"literal",value:'"branch"'},{name:"literal",value:'"brush"'},{name:"literal",value:'"bug"'},{name:"literal",value:'"building-1"'},{name:"literal",value:'"building-2"'},{name:"literal",value:'"building-3"'},{name:"literal",value:'"building-4"'},{name:"literal",value:'"building-5"'},{name:"literal",value:'"building-6"'},{name:"literal",value:'"bulb"'},{name:"literal",value:'"bulb-slash"'},{name:"literal",value:'"bus"'},{name:"literal",value:'"calendar"'},{name:"literal",value:'"calendar-add"'},{name:"literal",value:'"calendar-alt"'},{name:"literal",value:'"calendar-cross"'},{name:"literal",value:'"calendar-remove"'},{name:"literal",value:'"calendar-tick"'},{name:"literal",value:'"call"'},{name:"literal",value:'"call-add"'},{name:"literal",value:'"call-cross"'},{name:"literal",value:'"call-incoming"'},{name:"literal",value:'"call-outgoing"'},{name:"literal",value:'"call-remove"'},{name:"literal",value:'"call-ringing"'},{name:"literal",value:'"camera"'},{name:"literal",value:'"camera-slash"'},{name:"literal",value:'"candles-h"'},{name:"literal",value:'"candles-v"'},{name:"literal",value:'"car"'},{name:"literal",value:'"card"'},{name:"literal",value:'"card-add"'},{name:"literal",value:'"card-cross"'},{name:"literal",value:'"card-fund"'},{name:"literal",value:'"card-in"'},{name:"literal",value:'"card-out"'},{name:"literal",value:'"card-remove"'},{name:"literal",value:'"card-tick"'},{name:"literal",value:'"card-withdraw"'},{name:"literal",value:'"cart"'},{name:"literal",value:'"cart-add"'},{name:"literal",value:'"cart-check"'},{name:"literal",value:'"cart-cross"'},{name:"literal",value:'"cart-minus"'},{name:"literal",value:'"chart"'},{name:"literal",value:'"chart-down"'},{name:"literal",value:'"chart-up"'},{name:"literal",value:'"chat"'},{name:"literal",value:'"chat-alt"'},{name:"literal",value:'"chats"'},{name:"literal",value:'"check"'},{name:"literal",value:'"check-circle"'},{name:"literal",value:'"checkbox"'},{name:"literal",value:'"checkbox-checked"'},{name:"literal",value:'"chevron-down"'},{name:"literal",value:'"chevron-h"'},{name:"literal",value:'"chevron-left"'},{name:"literal",value:'"chevron-right"'},{name:"literal",value:'"chevron-up"'},{name:"literal",value:'"chevron-v"'},{name:"literal",value:'"clipboard"'},{name:"literal",value:'"clock"'},{name:"literal",value:'"cloud"'},{name:"literal",value:'"cloud-1"'},{name:"literal",value:'"cloud-download"'},{name:"literal",value:'"cloud-info"'},{name:"literal",value:'"cloud-lightning"'},{name:"literal",value:'"cloud-rain"'},{name:"literal",value:'"cloud-slash"'},{name:"literal",value:'"cloud-snowy"'},{name:"literal",value:'"cloud-upload"'},{name:"literal",value:'"clouds"'},{name:"literal",value:'"code"'},{name:"literal",value:'"code-2"'},{name:"literal",value:'"coin-stack"'},{name:"literal",value:'"coin-swap"'},{name:"literal",value:'"coins"'},{name:"literal",value:'"coins-alt"'},{name:"literal",value:'"color-picker"'},{name:"literal",value:'"column"'},{name:"literal",value:'"compass"'},{name:"literal",value:'"conical-flask"'},{name:"literal",value:'"copy"'},{name:"literal",value:'"corner"'},{name:"literal",value:'"corner-down-left"'},{name:"literal",value:'"corner-down-right"'},{name:"literal",value:'"corner-left-down"'},{name:"literal",value:'"corner-left-up"'},{name:"literal",value:'"corner-right-down"'},{name:"literal",value:'"corner-right-up"'},{name:"literal",value:'"corner-up-left"'},{name:"literal",value:'"corner-up-right"'},{name:"literal",value:'"crop"'},{name:"literal",value:'"cup"'},{name:"literal",value:'"cursor"'},{name:"literal",value:'"data"'},{name:"literal",value:'"devices"'},{name:"literal",value:'"dislike"'},{name:"literal",value:'"division"'},{name:"literal",value:'"dollar"'},{name:"literal",value:'"dots-h"'},{name:"literal",value:'"dots-h-circle"'},{name:"literal",value:'"dots-v"'},{name:"literal",value:'"dots-v-circle"'},{name:"literal",value:'"download"'},{name:"literal",value:'"elements"'},{name:"literal",value:'"emoji"'},{name:"literal",value:'"emoji-add"'},{name:"literal",value:'"euro"'},{name:"literal",value:'"expand"'},{name:"literal",value:'"eye"'},{name:"literal",value:'"eye-slash"'},{name:"literal",value:'"face-id"'},{name:"literal",value:'"feather"'},{name:"literal",value:'"feather-AI"'},{name:"literal",value:'"feather-add"'},{name:"literal",value:'"file"'},{name:"literal",value:'"file-alt"'},{name:"literal",value:'"file-cloud"'},{name:"literal",value:'"file-code"'},{name:"literal",value:'"file-download"'},{name:"literal",value:'"file-upload"'},{name:"literal",value:'"filter"'},{name:"literal",value:'"filter-alt"'},{name:"literal",value:'"fingerprint"'},{name:"literal",value:'"first-aid"'},{name:"literal",value:'"flag"'},{name:"literal",value:'"flower"'},{name:"literal",value:'"folder"'},{name:"literal",value:'"folder-add"'},{name:"literal",value:'"folder-cloud"'},{name:"literal",value:'"folder-cross"'},{name:"literal",value:'"folder-download"'},{name:"literal",value:'"folder-lock"'},{name:"literal",value:'"folder-move"'},{name:"literal",value:'"folder-shield"'},{name:"literal",value:'"folder-upload"'},{name:"literal",value:'"folder-user"'},{name:"literal",value:'"fork"'},{name:"literal",value:'"forward"'},{name:"literal",value:'"game-pad"'},{name:"literal",value:'"gear-AI"'},{name:"literal",value:'"gem"'},{name:"literal",value:'"gift"'},{name:"literal",value:'"globe"'},{name:"literal",value:'"globe-alt"'},{name:"literal",value:'"gps"'},{name:"literal",value:'"graduating cap"'},{name:"literal",value:'"grid"'},{name:"literal",value:'"grid-2"'},{name:"literal",value:'"hashtag"'},{name:"literal",value:'"heading"'},{name:"literal",value:'"headphones"'},{name:"literal",value:'"headset"'},{name:"literal",value:'"health-plus"'},{name:"literal",value:'"heart"'},{name:"literal",value:'"heart-beat"'},{name:"literal",value:'"heart-beat-wave"'},{name:"literal",value:'"history"'},{name:"literal",value:'"home"'},{name:"literal",value:'"home-alt"'},{name:"literal",value:'"image"'},{name:"literal",value:'"image-add"'},{name:"literal",value:'"image-check"'},{name:"literal",value:'"image-circle"'},{name:"literal",value:'"image-cross"'},{name:"literal",value:'"image-remove"'},{name:"literal",value:'"info-circle"'},{name:"literal",value:'"info-hexagon"'},{name:"literal",value:'"info-triangle"'},{name:"literal",value:'"italics"'},{name:"literal",value:'"key"'},{name:"literal",value:'"keyboard"'},{name:"literal",value:'"lamp"'},{name:"literal",value:'"laptop"'},{name:"literal",value:'"layer"'},{name:"literal",value:'"lifebuoy"'},{name:"literal",value:'"lightning"'},{name:"literal",value:'"lightning-off"'},{name:"literal",value:'"like"'},{name:"literal",value:'"line-height"'},{name:"literal",value:'"link"'},{name:"literal",value:'"link-detach"'},{name:"literal",value:'"list"'},{name:"literal",value:'"list-add"'},{name:"literal",value:'"lock"'},{name:"literal",value:'"lock-open"'},{name:"literal",value:'"loudspeaker"'},{name:"literal",value:'"magic-wand"'},{name:"literal",value:'"mail"'},{name:"literal",value:'"mail-add"'},{name:"literal",value:'"mail-check"'},{name:"literal",value:'"mail-cross"'},{name:"literal",value:'"mail-remove"'},{name:"literal",value:'"map"'},{name:"literal",value:'"map-alt"'},{name:"literal",value:'"map-marker"'},{name:"literal",value:'"media"'},{name:"literal",value:'"merge"'},{name:"literal",value:'"message"'},{name:"literal",value:'"message-alt"'},{name:"literal",value:'"messages"'},{name:"literal",value:'"microphone"'},{name:"literal",value:'"microphone-slash"'},{name:"literal",value:'"minus"'},{name:"literal",value:'"minus-circle"'},{name:"literal",value:'"mobile"'},{name:"literal",value:'"money"'},{name:"literal",value:'"money-1"'},{name:"literal",value:'"money-2"'},{name:"literal",value:'"moon"'},{name:"literal",value:'"moon-cloud"'},{name:"literal",value:'"moon-stars"'},{name:"literal",value:'"mouse"'},{name:"literal",value:'"move"'},{name:"literal",value:'"multiply"'},{name:"literal",value:'"multiply-circle"'},{name:"literal",value:'"music"'},{name:"literal",value:'"music-AI"'},{name:"literal",value:'"music-note"'},{name:"literal",value:'"naira"'},{name:"literal",value:'"navigation"'},{name:"literal",value:'"navigation-alt"'},{name:"literal",value:'"newspaper"'},{name:"literal",value:'"next"'},{name:"literal",value:'"paint-brush"'},{name:"literal",value:'"paint-bucket"'},{name:"literal",value:'"palette"'},{name:"literal",value:'"paper-clip"'},{name:"literal",value:'"paragraph-spacing"'},{name:"literal",value:'"pause"'},{name:"literal",value:'"pc"'},{name:"literal",value:'"pc-lock"'},{name:"literal",value:'"pc-speaker"'},{name:"literal",value:'"pc-user"'},{name:"literal",value:'"pencil"'},{name:"literal",value:'"pencil-edit"'},{name:"literal",value:'"pie-chart"'},{name:"literal",value:'"pin"'},{name:"literal",value:'"pin-alt"'},{name:"literal",value:'"plant"'},{name:"literal",value:'"plant-2"'},{name:"literal",value:'"play"'},{name:"literal",value:'"playlist"'},{name:"literal",value:'"plus"'},{name:"literal",value:'"plus-circle"'},{name:"literal",value:'"pounds"'},{name:"literal",value:'"power"'},{name:"literal",value:'"previous"'},{name:"literal",value:'"printer"'},{name:"literal",value:'"processor"'},{name:"literal",value:'"pull-request"'},{name:"literal",value:'"question-circle"'},{name:"literal",value:'"quote"'},{name:"literal",value:'"radio-button"'},{name:"literal",value:'"radio-selected"'},{name:"literal",value:'"receipt"'},{name:"literal",value:'"redo"'},{name:"literal",value:'"refresh"'},{name:"literal",value:'"repeat"'},{name:"literal",value:'"repeat-once"'},{name:"literal",value:'"road-sign"'},{name:"literal",value:'"rocket"'},{name:"literal",value:'"rocket-alt"'},{name:"literal",value:'"rotate-left"'},{name:"literal",value:'"rotate-right"'},{name:"literal",value:'"route"'},{name:"literal",value:'"row"'},{name:"literal",value:'"save"'},{name:"literal",value:'"scan"'},{name:"literal",value:'"scissor"'},{name:"literal",value:'"screenshot"'},{name:"literal",value:'"search"'},{name:"literal",value:'"send"'},{name:"literal",value:'"send-AI"'},{name:"literal",value:'"send-alt"'},{name:"literal",value:'"server"'},{name:"literal",value:'"server-alt"'},{name:"literal",value:'"settings"'},{name:"literal",value:'"settings-1"'},{name:"literal",value:'"settings-2"'},{name:"literal",value:'"share"'},{name:"literal",value:'"share-alt"'},{name:"literal",value:'"shield"'},{name:"literal",value:'"shield-cross"'},{name:"literal",value:'"shield-tick"'},{name:"literal",value:'"ship"'},{name:"literal",value:'"shower"'},{name:"literal",value:'"shrink"'},{name:"literal",value:'"shrink-alt"'},{name:"literal",value:'"shuffle"'},{name:"literal",value:'"sign-in"'},{name:"literal",value:'"sign-out"'},{name:"literal",value:'"signal"'},{name:"literal",value:'"signal-off"'},{name:"literal",value:'"sim"'},{name:"literal",value:'"snooze"'},{name:"literal",value:'"snowflake"'},{name:"literal",value:'"sofa"'},{name:"literal",value:'"speaker"'},{name:"literal",value:'"star"'},{name:"literal",value:'"stars"'},{name:"literal",value:'"stop"'},{name:"literal",value:'"stopwatch"'},{name:"literal",value:'"store"'},{name:"literal",value:'"strikethrough"'},{name:"literal",value:'"subscript"'},{name:"literal",value:'"suitcase"'},{name:"literal",value:'"sun"'},{name:"literal",value:'"sun-cloud"'},{name:"literal",value:'"superscript"'},{name:"literal",value:'"support"'},{name:"literal",value:'"switch-diagonal"'},{name:"literal",value:'"switch-horizontal"'},{name:"literal",value:'"switch-vertical"'},{name:"literal",value:'"tablet"'},{name:"literal",value:'"target"'},{name:"literal",value:'"taxi"'},{name:"literal",value:'"terminal"'},{name:"literal",value:'"text"'},{name:"literal",value:'"thermometer"'},{name:"literal",value:'"ticket"'},{name:"literal",value:'"tissue"'},{name:"literal",value:'"train"'},{name:"literal",value:'"trophy"'},{name:"literal",value:'"truck"'},{name:"literal",value:'"tv"'},{name:"literal",value:'"underline"'},{name:"literal",value:'"undo"'},{name:"literal",value:'"upload"'},{name:"literal",value:'"user"'},{name:"literal",value:'"user-add"'},{name:"literal",value:'"user-circle"'},{name:"literal",value:'"user-cross"'},{name:"literal",value:'"user-group"'},{name:"literal",value:'"user-heart"'},{name:"literal",value:'"user-remove"'},{name:"literal",value:'"user-tick"'},{name:"literal",value:'"users"'},{name:"literal",value:'"verified"'},{name:"literal",value:'"video"'},{name:"literal",value:'"video-slash"'},{name:"literal",value:'"voice-note"'},{name:"literal",value:'"volume"'},{name:"literal",value:'"volume-low"'},{name:"literal",value:'"volume-mute"'},{name:"literal",value:'"volume-slash"'},{name:"literal",value:'"wallet"'},{name:"literal",value:'"wallet-add"'},{name:"literal",value:'"wallet-check"'},{name:"literal",value:'"wallet-cross"'},{name:"literal",value:'"wallet-fund"'},{name:"literal",value:'"wallet-remove"'},{name:"literal",value:'"wallet-withdraw"'},{name:"literal",value:'"water-drop"'},{name:"literal",value:'"wifi"'},{name:"literal",value:'"wristwatch"'},{name:"literal",value:'"yen"'},{name:"literal",value:'"zoom-in"'},{name:"literal",value:'"zoom-out"'}]}]},description:"Leading icon — accepts a ReactNode or IconName string"},avatar:{required:!1,tsType:{name:"ReactNode"},description:"Leading avatar element (e.g., <Avatar />)"},statusColor:{required:!1,tsType:{name:"string"},description:'Status dot color (CSS color string, e.g., "#04802E")'},description:{required:!1,tsType:{name:"string"},description:"Supporting text shown after the label"},disabled:{required:!1,tsType:{name:"boolean"},description:"Whether this option is disabled",defaultValue:{value:"false",computed:!1}}},composes:["Omit"]};const le={title:"Components/Select",component:s,tags:["autodocs"]},j={render:()=>e.jsx("div",{className:"w-[375px] p-6",children:e.jsxs(s,{label:"Label",placeholder:"Placeholder",children:[e.jsx(a,{value:"home",children:"Home"}),e.jsx(a,{value:"search",children:"Search"}),e.jsx(a,{value:"notifications",children:"Notifications"}),e.jsx(a,{value:"settings",children:"Settings"}),e.jsx(a,{value:"profile",children:"Profile"})]})})},N={render:()=>e.jsx("div",{className:"w-[375px] p-6",children:e.jsxs(s,{label:"Label",placeholder:"Placeholder",children:[e.jsx(a,{value:"account",description:"@account",children:"Account settings"}),e.jsx(a,{value:"profile",description:"@profile",children:"Profile settings"}),e.jsx(a,{value:"billing",description:"@billing",children:"Billing settings"}),e.jsx(a,{value:"security",description:"@security",children:"Security settings"})]})})},C={render:()=>e.jsx("div",{className:"w-[375px] p-6",children:e.jsxs(s,{label:"Label",placeholder:"Placeholder",children:[e.jsx(a,{value:"heart",icon:"heart",description:"@favorites",children:"Favorites"}),e.jsx(a,{value:"star",icon:"star",description:"@starred",children:"Starred"}),e.jsx(a,{value:"bookmark",icon:"bookmark",description:"@bookmarks",children:"Bookmarks"}),e.jsx(a,{value:"archive",icon:"archive",description:"@archive",children:"Archive"})]})})},A={render:()=>e.jsx("div",{className:"w-[375px] p-6",children:e.jsxs(s,{label:"Label",placeholder:"Placeholder",children:[e.jsx(a,{value:"john",avatar:e.jsx(O,{type:"initials",initials:"JD",size:"xs"}),description:"@john",children:"John Doe"}),e.jsx(a,{value:"jane",avatar:e.jsx(O,{type:"initials",initials:"JS",size:"xs"}),description:"@jane",children:"Jane Smith"}),e.jsx(a,{value:"bob",avatar:e.jsx(O,{type:"initials",initials:"BW",size:"xs"}),description:"@bob",children:"Bob Wilson"}),e.jsx(a,{value:"alice",avatar:e.jsx(O,{type:"initials",initials:"AB",size:"xs"}),description:"@alice",children:"Alice Brown"})]})})},D={render:()=>e.jsx("div",{className:"w-[375px] p-6",children:e.jsxs(s,{label:"Label",placeholder:"Placeholder",children:[e.jsx(a,{value:"online",statusColor:"#04802E",description:"@online",children:"Online"}),e.jsx(a,{value:"away",statusColor:"#F5B546",description:"@away",children:"Away"}),e.jsx(a,{value:"busy",statusColor:"#CB1A14",description:"@busy",children:"Do not disturb"}),e.jsx(a,{value:"offline",statusColor:"#D0D5DD",description:"@offline",children:"Offline"})]})})},T={render:()=>e.jsx("div",{className:"w-[375px] p-6",children:e.jsxs(s,{label:"Label",placeholder:"Placeholder",helperText:"Helper text",children:[e.jsx(a,{value:"opt1",children:"Option 1"}),e.jsx(a,{value:"opt2",children:"Option 2"}),e.jsx(a,{value:"opt3",children:"Option 3"})]})})},L={render:()=>e.jsx("div",{className:"w-[375px] p-6",children:e.jsxs(s,{label:"Label",defaultValue:"settings",placeholder:"Placeholder",children:[e.jsx(a,{value:"home",children:"Home"}),e.jsx(a,{value:"search",children:"Search"}),e.jsx(a,{value:"settings",children:"Settings"}),e.jsx(a,{value:"profile",children:"Profile"})]})})},P={render:()=>e.jsx("div",{className:"w-[375px] p-6",children:e.jsxs(s,{label:"Label",placeholder:"Placeholder",disabled:!0,children:[e.jsx(a,{value:"opt1",children:"Option 1"}),e.jsx(a,{value:"opt2",children:"Option 2"})]})})},q={render:()=>e.jsx("div",{className:"w-[375px] p-6",children:e.jsxs(s,{label:"Label",placeholder:"Placeholder",children:[e.jsx(a,{value:"opt1",children:"Option 1"}),e.jsx(a,{value:"opt2",disabled:!0,children:"Option 2 (disabled)"}),e.jsx(a,{value:"opt3",children:"Option 3"}),e.jsx(a,{value:"opt4",disabled:!0,children:"Option 4 (disabled)"})]})})},z={render:()=>{const o=()=>{const[m,c]=n.useState("search");return e.jsxs("div",{className:"w-[375px] space-y-4 p-6",children:[e.jsxs(s,{label:"Label",placeholder:"Placeholder",value:m,onValueChange:c,children:[e.jsx(a,{value:"home",icon:"home",children:"Home"}),e.jsx(a,{value:"search",icon:"search",children:"Search"}),e.jsx(a,{value:"settings",icon:"settings",children:"Settings"}),e.jsx(a,{value:"profile",icon:"user",children:"Profile"})]}),e.jsxs("p",{className:"text-body-sm text-grey-500",children:["Selected value: ",e.jsx("span",{className:"font-medium text-grey-900",children:m||"none"})]})]})};return e.jsx(o,{})}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-[375px] p-6">
      <Select label="Label" placeholder="Placeholder">
        <SelectOption value="home">Home</SelectOption>
        <SelectOption value="search">Search</SelectOption>
        <SelectOption value="notifications">Notifications</SelectOption>
        <SelectOption value="settings">Settings</SelectOption>
        <SelectOption value="profile">Profile</SelectOption>
      </Select>
    </div>
}`,...j.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-[375px] p-6">
      <Select label="Label" placeholder="Placeholder">
        <SelectOption value="account" description="@account">
          Account settings
        </SelectOption>
        <SelectOption value="profile" description="@profile">
          Profile settings
        </SelectOption>
        <SelectOption value="billing" description="@billing">
          Billing settings
        </SelectOption>
        <SelectOption value="security" description="@security">
          Security settings
        </SelectOption>
      </Select>
    </div>
}`,...N.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-[375px] p-6">
      <Select label="Label" placeholder="Placeholder">
        <SelectOption value="heart" icon="heart" description="@favorites">
          Favorites
        </SelectOption>
        <SelectOption value="star" icon="star" description="@starred">
          Starred
        </SelectOption>
        <SelectOption value="bookmark" icon="bookmark" description="@bookmarks">
          Bookmarks
        </SelectOption>
        <SelectOption value="archive" icon="archive" description="@archive">
          Archive
        </SelectOption>
      </Select>
    </div>
}`,...C.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-[375px] p-6">
      <Select label="Label" placeholder="Placeholder">
        <SelectOption value="john" avatar={<Avatar type="initials" initials="JD" size="xs" />} description="@john">
          John Doe
        </SelectOption>
        <SelectOption value="jane" avatar={<Avatar type="initials" initials="JS" size="xs" />} description="@jane">
          Jane Smith
        </SelectOption>
        <SelectOption value="bob" avatar={<Avatar type="initials" initials="BW" size="xs" />} description="@bob">
          Bob Wilson
        </SelectOption>
        <SelectOption value="alice" avatar={<Avatar type="initials" initials="AB" size="xs" />} description="@alice">
          Alice Brown
        </SelectOption>
      </Select>
    </div>
}`,...A.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-[375px] p-6">
      <Select label="Label" placeholder="Placeholder">
        <SelectOption value="online" statusColor="#04802E" description="@online">
          Online
        </SelectOption>
        <SelectOption value="away" statusColor="#F5B546" description="@away">
          Away
        </SelectOption>
        <SelectOption value="busy" statusColor="#CB1A14" description="@busy">
          Do not disturb
        </SelectOption>
        <SelectOption value="offline" statusColor="#D0D5DD" description="@offline">
          Offline
        </SelectOption>
      </Select>
    </div>
}`,...D.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-[375px] p-6">
      <Select label="Label" placeholder="Placeholder" helperText="Helper text">
        <SelectOption value="opt1">Option 1</SelectOption>
        <SelectOption value="opt2">Option 2</SelectOption>
        <SelectOption value="opt3">Option 3</SelectOption>
      </Select>
    </div>
}`,...T.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-[375px] p-6">
      <Select label="Label" defaultValue="settings" placeholder="Placeholder">
        <SelectOption value="home">Home</SelectOption>
        <SelectOption value="search">Search</SelectOption>
        <SelectOption value="settings">Settings</SelectOption>
        <SelectOption value="profile">Profile</SelectOption>
      </Select>
    </div>
}`,...L.parameters?.docs?.source}}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-[375px] p-6">
      <Select label="Label" placeholder="Placeholder" disabled>
        <SelectOption value="opt1">Option 1</SelectOption>
        <SelectOption value="opt2">Option 2</SelectOption>
      </Select>
    </div>
}`,...P.parameters?.docs?.source}}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-[375px] p-6">
      <Select label="Label" placeholder="Placeholder">
        <SelectOption value="opt1">Option 1</SelectOption>
        <SelectOption value="opt2" disabled>
          Option 2 (disabled)
        </SelectOption>
        <SelectOption value="opt3">Option 3</SelectOption>
        <SelectOption value="opt4" disabled>
          Option 4 (disabled)
        </SelectOption>
      </Select>
    </div>
}`,...q.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  render: () => {
    const ControlledDemo = () => {
      const [value, setValue] = useState("search");
      return <div className="w-[375px] space-y-4 p-6">
          <Select label="Label" placeholder="Placeholder" value={value} onValueChange={setValue}>
            <SelectOption value="home" icon="home">
              Home
            </SelectOption>
            <SelectOption value="search" icon="search">
              Search
            </SelectOption>
            <SelectOption value="settings" icon="settings">
              Settings
            </SelectOption>
            <SelectOption value="profile" icon="user">
              Profile
            </SelectOption>
          </Select>
          <p className="text-body-sm text-grey-500">
            Selected value: <span className="font-medium text-grey-900">{value || "none"}</span>
          </p>
        </div>;
    };
    return <ControlledDemo />;
  }
}`,...z.parameters?.docs?.source}}};const ne=["Default","WithDescriptions","WithIcons","WithAvatars","WithStatus","WithHelperText","Filled","Disabled","WithDisabledOptions","Controlled"];export{z as Controlled,j as Default,P as Disabled,L as Filled,A as WithAvatars,N as WithDescriptions,q as WithDisabledOptions,T as WithHelperText,C as WithIcons,D as WithStatus,ne as __namedExportsOrder,le as default};
