import{j as e}from"./jsx-runtime-u17CrQMm.js";import{r as t}from"./iframe-g5PiM8Jh.js";import{c as o}from"./cn-C8nBGPD0.js";import{r as O}from"./resolveIcon-B4eesLNI.js";import{I as D}from"./Icon-CxPrjGB-.js";import{A as _}from"./Avatar-BvmkuJdv.js";import{I as U}from"./Input-Cde_iS42.js";import"./preload-helper-PPVm8Dsz.js";const C={light:{container:"bg-white",defaultText:"text-grey-700",defaultIcon:"text-grey-400",selectedBg:"bg-primary-50",selectedText:"text-grey-900",selectedBorder:"border-l-2 border-primary-400",selectedIcon:"text-grey-900",hoverBg:"hover:bg-grey-50",sectionTitle:"text-grey-400",divider:"border-grey-100",badgeDefault:"bg-grey-100 text-grey-700",badgeSelected:"bg-primary-75 text-primary-700"},blue:{container:"bg-[#1671D9]",defaultText:"text-white",defaultIcon:"text-white/70",selectedBg:"bg-[#0D5EBA]",selectedText:"text-white",selectedBorder:"",selectedIcon:"text-white",hoverBg:"hover:bg-[#0D5EBA]/50",sectionTitle:"text-[#B6D8FF]",divider:"border-[#80BBFF]",badgeDefault:"bg-grey-100 text-grey-700",badgeSelected:"bg-grey-100 text-grey-700"},"dark-blue":{container:"bg-[#04326B]",defaultText:"text-[#C6DDF7]",defaultIcon:"text-[#C6DDF7]/70",selectedBg:"bg-[#034592]",selectedText:"text-white",selectedBorder:"",selectedIcon:"text-white",hoverBg:"hover:bg-[#034592]/50",sectionTitle:"text-[#E3EFFC]",divider:"border-[#80BBFF]",badgeDefault:"bg-grey-100 text-grey-700",badgeSelected:"bg-grey-100 text-grey-700"},"dark-grey":{container:"bg-grey-900",defaultText:"text-grey-100",defaultIcon:"text-grey-100/70",selectedBg:"bg-grey-800",selectedText:"text-white",selectedBorder:"",selectedIcon:"text-white",hoverBg:"hover:bg-grey-800/50",sectionTitle:"text-grey-400",divider:"border-grey-700",badgeDefault:"bg-grey-100 text-grey-700",badgeSelected:"bg-grey-100 text-grey-700"}},P=t.createContext(null);function R(){const a=t.useContext(P);if(!a)throw new Error("SidebarMenuItem / SidebarMenuSection must be used within SidebarMenu");return a}const b=t.forwardRef(({value:a,defaultValue:n="",onValueChange:r,collapsed:s=!1,theme:c="light",children:d,className:p,...g},m)=>{const[v,B]=t.useState(n),z=a??v,i=t.useCallback(x=>{a===void 0&&B(x),r?.(x)},[a,r]),q=C[c];return e.jsx(P.Provider,{value:{activeValue:z,onSelect:i,collapsed:s,theme:c},children:e.jsx("nav",{ref:m,role:"navigation",className:o("flex flex-col gap-3 overflow-y-auto rounded-xl py-6",q.container,s?"w-[82px] items-center px-3":"w-[272px] px-4",p),...g,children:d})})});b.displayName="SidebarMenu";b.__docgenInfo={description:"",methods:[],displayName:"SidebarMenu",props:{value:{required:!1,tsType:{name:"string"},description:"Controlled active item value"},defaultValue:{required:!1,tsType:{name:"string"},description:"Uncontrolled default active item",defaultValue:{value:'""',computed:!1}},onValueChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: string) => void",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"void"}}},description:"Called when active item changes"},collapsed:{required:!1,tsType:{name:"boolean"},description:"Collapsed icon-only mode (82 px wide)",defaultValue:{value:"false",computed:!1}},theme:{required:!1,tsType:{name:"union",raw:'"light" | "blue" | "dark-blue" | "dark-grey"',elements:[{name:"literal",value:'"light"'},{name:"literal",value:'"blue"'},{name:"literal",value:'"dark-blue"'},{name:"literal",value:'"dark-grey"'}]},description:"Color theme",defaultValue:{value:'"light"',computed:!1}},children:{required:!0,tsType:{name:"ReactNode"},description:""}},composes:["HTMLAttributes"]};function j({children:a}){return e.jsx("div",{className:"flex flex-col gap-1",children:a})}j.displayName="SidebarMenuSub";const f=t.forwardRef(({value:a,children:n,className:r,...s},c)=>{const{activeValue:d,onSelect:p,theme:g}=R(),m=d===a,v=C[g];return e.jsx("button",{ref:c,type:"button",role:"menuitem",onClick:()=>p(a),className:o("flex w-full cursor-pointer items-center rounded py-3 pl-12 pr-4 text-left text-body-sm transition-colors",m?o(v.selectedBg,"font-medium",v.selectedText):o(v.defaultText,v.hoverBg),r),...s,children:n})});f.displayName="SidebarMenuSubItem";const l=t.forwardRef(({value:a,icon:n,badge:r,disabled:s=!1,children:c,className:d,...p},g)=>{const{activeValue:m,onSelect:v,collapsed:B,theme:z}=R(),i=C[z],q=m===a;let x=null,y=null;t.Children.forEach(c,h=>{t.isValidElement(h)&&h.type===j?y=h:x=h});const S=y!==null,[E,H]=t.useState(!1);let F=!1;S&&t.isValidElement(y)&&t.Children.forEach(y.props.children,h=>{t.isValidElement(h)&&h.props.value===m&&(F=!0)});const w=q||F,L=()=>{s||(S?H(h=>!h):v(a))},V=O(n,"md");return B?e.jsx("button",{ref:g,type:"button",role:"menuitem",disabled:s,onClick:()=>{!s&&!S&&v(a)},title:typeof x=="string"?x:void 0,className:o("flex size-11 cursor-pointer items-center justify-center rounded transition-colors",w?o(i.selectedBg,i.selectedIcon):o(i.defaultIcon,i.hoverBg),s&&"pointer-events-none opacity-50",d),...p,children:V}):e.jsxs("div",{children:[e.jsxs("button",{ref:g,type:"button",role:"menuitem",disabled:s,onClick:L,className:o("flex w-full cursor-pointer items-center gap-1 rounded py-3 px-4 text-left text-body-sm transition-colors",w?o(i.selectedBg,i.selectedBorder,"font-medium",i.selectedText):o(i.defaultText,i.hoverBg),s&&"pointer-events-none opacity-50",d),...p,children:[V&&e.jsx("span",{className:o("shrink-0",w?i.selectedIcon:i.defaultIcon),children:V}),e.jsx("span",{className:"flex-1 truncate",children:x}),r!=null&&e.jsx("span",{className:o("ml-auto shrink-0 rounded-[10px] px-2 text-body-xs font-medium",w?i.badgeSelected:i.badgeDefault),children:r}),S&&e.jsx(D,{name:E?"chevron-up":"chevron-down",size:"sm",className:o("ml-1 shrink-0 transition-transform",w?i.selectedIcon:i.defaultIcon)})]}),S&&E&&e.jsx("div",{className:"mt-1",children:y})]})});l.displayName="SidebarMenuItem";j.__docgenInfo={description:"",methods:[],displayName:"SidebarMenuSub",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""}}};f.__docgenInfo={description:"",methods:[],displayName:"SidebarMenuSubItem",props:{value:{required:!0,tsType:{name:"string"},description:"Unique identifier for this sub-item"},children:{required:!0,tsType:{name:"ReactNode"},description:""}},composes:["ButtonHTMLAttributes"]};l.__docgenInfo={description:"",methods:[],displayName:"SidebarMenuItem",props:{value:{required:!0,tsType:{name:"string"},description:"Unique identifier for this item"},icon:{required:!1,tsType:{name:"union",raw:"ReactNode | IconName",elements:[{name:"ReactNode"},{name:"union",raw:`"3d"
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
| "zoom-out"`,elements:[{name:"literal",value:'"3d"'},{name:"literal",value:'"AI-stars"'},{name:"literal",value:'"AR"'},{name:"literal",value:'"BTC"'},{name:"literal",value:'"ETH"'},{name:"literal",value:'"NFT"'},{name:"literal",value:'"NFT-add"'},{name:"literal",value:'"NFT-profile"'},{name:"literal",value:'"NFT-remove"'},{name:"literal",value:'"QR-code"'},{name:"literal",value:'"VR-goggles"'},{name:"literal",value:'"airplane"'},{name:"literal",value:'"airpod"'},{name:"literal",value:'"alarm-clock"'},{name:"literal",value:'"align-center"'},{name:"literal",value:'"align-justify"'},{name:"literal",value:'"align-left"'},{name:"literal",value:'"align-right"'},{name:"literal",value:'"arrow-down"'},{name:"literal",value:'"arrow-down-left"'},{name:"literal",value:'"arrow-down-right"'},{name:"literal",value:'"arrow-expand"'},{name:"literal",value:'"arrow-left"'},{name:"literal",value:'"arrow-right"'},{name:"literal",value:'"arrow-shrink"'},{name:"literal",value:'"arrow-up"'},{name:"literal",value:'"arrow-up-left"'},{name:"literal",value:'"arrow-up-right"'},{name:"literal",value:'"arrow-up-split"'},{name:"literal",value:'"at"'},{name:"literal",value:'"backward"'},{name:"literal",value:'"badge"'},{name:"literal",value:'"bag"'},{name:"literal",value:'"ball"'},{name:"literal",value:'"bank"'},{name:"literal",value:'"bar-chart-h"'},{name:"literal",value:'"bar-chart-v"'},{name:"literal",value:'"battery"'},{name:"literal",value:'"battery-charging"'},{name:"literal",value:'"battery-empty"'},{name:"literal",value:'"bed"'},{name:"literal",value:'"beizer-curve"'},{name:"literal",value:'"bell"'},{name:"literal",value:'"bell-slash"'},{name:"literal",value:'"bicycle"'},{name:"literal",value:'"bin"'},{name:"literal",value:'"bluetooth"'},{name:"literal",value:'"bold"'},{name:"literal",value:'"book"'},{name:"literal",value:'"book-open"'},{name:"literal",value:'"bookmark"'},{name:"literal",value:'"bookmark-add"'},{name:"literal",value:'"bookmarks"'},{name:"literal",value:'"books"'},{name:"literal",value:'"bot"'},{name:"literal",value:'"box"'},{name:"literal",value:'"box-1"'},{name:"literal",value:'"branch"'},{name:"literal",value:'"brush"'},{name:"literal",value:'"bug"'},{name:"literal",value:'"building-1"'},{name:"literal",value:'"building-2"'},{name:"literal",value:'"building-3"'},{name:"literal",value:'"building-4"'},{name:"literal",value:'"building-5"'},{name:"literal",value:'"building-6"'},{name:"literal",value:'"bulb"'},{name:"literal",value:'"bulb-slash"'},{name:"literal",value:'"bus"'},{name:"literal",value:'"calendar"'},{name:"literal",value:'"calendar-add"'},{name:"literal",value:'"calendar-alt"'},{name:"literal",value:'"calendar-cross"'},{name:"literal",value:'"calendar-remove"'},{name:"literal",value:'"calendar-tick"'},{name:"literal",value:'"call"'},{name:"literal",value:'"call-add"'},{name:"literal",value:'"call-cross"'},{name:"literal",value:'"call-incoming"'},{name:"literal",value:'"call-outgoing"'},{name:"literal",value:'"call-remove"'},{name:"literal",value:'"call-ringing"'},{name:"literal",value:'"camera"'},{name:"literal",value:'"camera-slash"'},{name:"literal",value:'"candles-h"'},{name:"literal",value:'"candles-v"'},{name:"literal",value:'"car"'},{name:"literal",value:'"card"'},{name:"literal",value:'"card-add"'},{name:"literal",value:'"card-cross"'},{name:"literal",value:'"card-fund"'},{name:"literal",value:'"card-in"'},{name:"literal",value:'"card-out"'},{name:"literal",value:'"card-remove"'},{name:"literal",value:'"card-tick"'},{name:"literal",value:'"card-withdraw"'},{name:"literal",value:'"cart"'},{name:"literal",value:'"cart-add"'},{name:"literal",value:'"cart-check"'},{name:"literal",value:'"cart-cross"'},{name:"literal",value:'"cart-minus"'},{name:"literal",value:'"chart"'},{name:"literal",value:'"chart-down"'},{name:"literal",value:'"chart-up"'},{name:"literal",value:'"chat"'},{name:"literal",value:'"chat-alt"'},{name:"literal",value:'"chats"'},{name:"literal",value:'"check"'},{name:"literal",value:'"check-circle"'},{name:"literal",value:'"checkbox"'},{name:"literal",value:'"checkbox-checked"'},{name:"literal",value:'"chevron-down"'},{name:"literal",value:'"chevron-h"'},{name:"literal",value:'"chevron-left"'},{name:"literal",value:'"chevron-right"'},{name:"literal",value:'"chevron-up"'},{name:"literal",value:'"chevron-v"'},{name:"literal",value:'"clipboard"'},{name:"literal",value:'"clock"'},{name:"literal",value:'"cloud"'},{name:"literal",value:'"cloud-1"'},{name:"literal",value:'"cloud-download"'},{name:"literal",value:'"cloud-info"'},{name:"literal",value:'"cloud-lightning"'},{name:"literal",value:'"cloud-rain"'},{name:"literal",value:'"cloud-slash"'},{name:"literal",value:'"cloud-snowy"'},{name:"literal",value:'"cloud-upload"'},{name:"literal",value:'"clouds"'},{name:"literal",value:'"code"'},{name:"literal",value:'"code-2"'},{name:"literal",value:'"coin-stack"'},{name:"literal",value:'"coin-swap"'},{name:"literal",value:'"coins"'},{name:"literal",value:'"coins-alt"'},{name:"literal",value:'"color-picker"'},{name:"literal",value:'"column"'},{name:"literal",value:'"compass"'},{name:"literal",value:'"conical-flask"'},{name:"literal",value:'"copy"'},{name:"literal",value:'"corner"'},{name:"literal",value:'"corner-down-left"'},{name:"literal",value:'"corner-down-right"'},{name:"literal",value:'"corner-left-down"'},{name:"literal",value:'"corner-left-up"'},{name:"literal",value:'"corner-right-down"'},{name:"literal",value:'"corner-right-up"'},{name:"literal",value:'"corner-up-left"'},{name:"literal",value:'"corner-up-right"'},{name:"literal",value:'"crop"'},{name:"literal",value:'"cup"'},{name:"literal",value:'"cursor"'},{name:"literal",value:'"data"'},{name:"literal",value:'"devices"'},{name:"literal",value:'"dislike"'},{name:"literal",value:'"division"'},{name:"literal",value:'"dollar"'},{name:"literal",value:'"dots-h"'},{name:"literal",value:'"dots-h-circle"'},{name:"literal",value:'"dots-v"'},{name:"literal",value:'"dots-v-circle"'},{name:"literal",value:'"download"'},{name:"literal",value:'"elements"'},{name:"literal",value:'"emoji"'},{name:"literal",value:'"emoji-add"'},{name:"literal",value:'"euro"'},{name:"literal",value:'"expand"'},{name:"literal",value:'"eye"'},{name:"literal",value:'"eye-slash"'},{name:"literal",value:'"face-id"'},{name:"literal",value:'"feather"'},{name:"literal",value:'"feather-AI"'},{name:"literal",value:'"feather-add"'},{name:"literal",value:'"file"'},{name:"literal",value:'"file-alt"'},{name:"literal",value:'"file-cloud"'},{name:"literal",value:'"file-code"'},{name:"literal",value:'"file-download"'},{name:"literal",value:'"file-upload"'},{name:"literal",value:'"filter"'},{name:"literal",value:'"filter-alt"'},{name:"literal",value:'"fingerprint"'},{name:"literal",value:'"first-aid"'},{name:"literal",value:'"flag"'},{name:"literal",value:'"flower"'},{name:"literal",value:'"folder"'},{name:"literal",value:'"folder-add"'},{name:"literal",value:'"folder-cloud"'},{name:"literal",value:'"folder-cross"'},{name:"literal",value:'"folder-download"'},{name:"literal",value:'"folder-lock"'},{name:"literal",value:'"folder-move"'},{name:"literal",value:'"folder-shield"'},{name:"literal",value:'"folder-upload"'},{name:"literal",value:'"folder-user"'},{name:"literal",value:'"fork"'},{name:"literal",value:'"forward"'},{name:"literal",value:'"game-pad"'},{name:"literal",value:'"gear-AI"'},{name:"literal",value:'"gem"'},{name:"literal",value:'"gift"'},{name:"literal",value:'"globe"'},{name:"literal",value:'"globe-alt"'},{name:"literal",value:'"gps"'},{name:"literal",value:'"graduating cap"'},{name:"literal",value:'"grid"'},{name:"literal",value:'"grid-2"'},{name:"literal",value:'"hashtag"'},{name:"literal",value:'"heading"'},{name:"literal",value:'"headphones"'},{name:"literal",value:'"headset"'},{name:"literal",value:'"health-plus"'},{name:"literal",value:'"heart"'},{name:"literal",value:'"heart-beat"'},{name:"literal",value:'"heart-beat-wave"'},{name:"literal",value:'"history"'},{name:"literal",value:'"home"'},{name:"literal",value:'"home-alt"'},{name:"literal",value:'"image"'},{name:"literal",value:'"image-add"'},{name:"literal",value:'"image-check"'},{name:"literal",value:'"image-circle"'},{name:"literal",value:'"image-cross"'},{name:"literal",value:'"image-remove"'},{name:"literal",value:'"info-circle"'},{name:"literal",value:'"info-hexagon"'},{name:"literal",value:'"info-triangle"'},{name:"literal",value:'"italics"'},{name:"literal",value:'"key"'},{name:"literal",value:'"keyboard"'},{name:"literal",value:'"lamp"'},{name:"literal",value:'"laptop"'},{name:"literal",value:'"layer"'},{name:"literal",value:'"lifebuoy"'},{name:"literal",value:'"lightning"'},{name:"literal",value:'"lightning-off"'},{name:"literal",value:'"like"'},{name:"literal",value:'"line-height"'},{name:"literal",value:'"link"'},{name:"literal",value:'"link-detach"'},{name:"literal",value:'"list"'},{name:"literal",value:'"list-add"'},{name:"literal",value:'"lock"'},{name:"literal",value:'"lock-open"'},{name:"literal",value:'"loudspeaker"'},{name:"literal",value:'"magic-wand"'},{name:"literal",value:'"mail"'},{name:"literal",value:'"mail-add"'},{name:"literal",value:'"mail-check"'},{name:"literal",value:'"mail-cross"'},{name:"literal",value:'"mail-remove"'},{name:"literal",value:'"map"'},{name:"literal",value:'"map-alt"'},{name:"literal",value:'"map-marker"'},{name:"literal",value:'"media"'},{name:"literal",value:'"merge"'},{name:"literal",value:'"message"'},{name:"literal",value:'"message-alt"'},{name:"literal",value:'"messages"'},{name:"literal",value:'"microphone"'},{name:"literal",value:'"microphone-slash"'},{name:"literal",value:'"minus"'},{name:"literal",value:'"minus-circle"'},{name:"literal",value:'"mobile"'},{name:"literal",value:'"money"'},{name:"literal",value:'"money-1"'},{name:"literal",value:'"money-2"'},{name:"literal",value:'"moon"'},{name:"literal",value:'"moon-cloud"'},{name:"literal",value:'"moon-stars"'},{name:"literal",value:'"mouse"'},{name:"literal",value:'"move"'},{name:"literal",value:'"multiply"'},{name:"literal",value:'"multiply-circle"'},{name:"literal",value:'"music"'},{name:"literal",value:'"music-AI"'},{name:"literal",value:'"music-note"'},{name:"literal",value:'"naira"'},{name:"literal",value:'"navigation"'},{name:"literal",value:'"navigation-alt"'},{name:"literal",value:'"newspaper"'},{name:"literal",value:'"next"'},{name:"literal",value:'"paint-brush"'},{name:"literal",value:'"paint-bucket"'},{name:"literal",value:'"palette"'},{name:"literal",value:'"paper-clip"'},{name:"literal",value:'"paragraph-spacing"'},{name:"literal",value:'"pause"'},{name:"literal",value:'"pc"'},{name:"literal",value:'"pc-lock"'},{name:"literal",value:'"pc-speaker"'},{name:"literal",value:'"pc-user"'},{name:"literal",value:'"pencil"'},{name:"literal",value:'"pencil-edit"'},{name:"literal",value:'"pie-chart"'},{name:"literal",value:'"pin"'},{name:"literal",value:'"pin-alt"'},{name:"literal",value:'"plant"'},{name:"literal",value:'"plant-2"'},{name:"literal",value:'"play"'},{name:"literal",value:'"playlist"'},{name:"literal",value:'"plus"'},{name:"literal",value:'"plus-circle"'},{name:"literal",value:'"pounds"'},{name:"literal",value:'"power"'},{name:"literal",value:'"previous"'},{name:"literal",value:'"printer"'},{name:"literal",value:'"processor"'},{name:"literal",value:'"pull-request"'},{name:"literal",value:'"question-circle"'},{name:"literal",value:'"quote"'},{name:"literal",value:'"radio-button"'},{name:"literal",value:'"radio-selected"'},{name:"literal",value:'"receipt"'},{name:"literal",value:'"redo"'},{name:"literal",value:'"refresh"'},{name:"literal",value:'"repeat"'},{name:"literal",value:'"repeat-once"'},{name:"literal",value:'"road-sign"'},{name:"literal",value:'"rocket"'},{name:"literal",value:'"rocket-alt"'},{name:"literal",value:'"rotate-left"'},{name:"literal",value:'"rotate-right"'},{name:"literal",value:'"route"'},{name:"literal",value:'"row"'},{name:"literal",value:'"save"'},{name:"literal",value:'"scan"'},{name:"literal",value:'"scissor"'},{name:"literal",value:'"screenshot"'},{name:"literal",value:'"search"'},{name:"literal",value:'"send"'},{name:"literal",value:'"send-AI"'},{name:"literal",value:'"send-alt"'},{name:"literal",value:'"server"'},{name:"literal",value:'"server-alt"'},{name:"literal",value:'"settings"'},{name:"literal",value:'"settings-1"'},{name:"literal",value:'"settings-2"'},{name:"literal",value:'"share"'},{name:"literal",value:'"share-alt"'},{name:"literal",value:'"shield"'},{name:"literal",value:'"shield-cross"'},{name:"literal",value:'"shield-tick"'},{name:"literal",value:'"ship"'},{name:"literal",value:'"shower"'},{name:"literal",value:'"shrink"'},{name:"literal",value:'"shrink-alt"'},{name:"literal",value:'"shuffle"'},{name:"literal",value:'"sign-in"'},{name:"literal",value:'"sign-out"'},{name:"literal",value:'"signal"'},{name:"literal",value:'"signal-off"'},{name:"literal",value:'"sim"'},{name:"literal",value:'"snooze"'},{name:"literal",value:'"snowflake"'},{name:"literal",value:'"sofa"'},{name:"literal",value:'"speaker"'},{name:"literal",value:'"star"'},{name:"literal",value:'"stars"'},{name:"literal",value:'"stop"'},{name:"literal",value:'"stopwatch"'},{name:"literal",value:'"store"'},{name:"literal",value:'"strikethrough"'},{name:"literal",value:'"subscript"'},{name:"literal",value:'"suitcase"'},{name:"literal",value:'"sun"'},{name:"literal",value:'"sun-cloud"'},{name:"literal",value:'"superscript"'},{name:"literal",value:'"support"'},{name:"literal",value:'"switch-diagonal"'},{name:"literal",value:'"switch-horizontal"'},{name:"literal",value:'"switch-vertical"'},{name:"literal",value:'"tablet"'},{name:"literal",value:'"target"'},{name:"literal",value:'"taxi"'},{name:"literal",value:'"terminal"'},{name:"literal",value:'"text"'},{name:"literal",value:'"thermometer"'},{name:"literal",value:'"ticket"'},{name:"literal",value:'"tissue"'},{name:"literal",value:'"train"'},{name:"literal",value:'"trophy"'},{name:"literal",value:'"truck"'},{name:"literal",value:'"tv"'},{name:"literal",value:'"underline"'},{name:"literal",value:'"undo"'},{name:"literal",value:'"upload"'},{name:"literal",value:'"user"'},{name:"literal",value:'"user-add"'},{name:"literal",value:'"user-circle"'},{name:"literal",value:'"user-cross"'},{name:"literal",value:'"user-group"'},{name:"literal",value:'"user-heart"'},{name:"literal",value:'"user-remove"'},{name:"literal",value:'"user-tick"'},{name:"literal",value:'"users"'},{name:"literal",value:'"verified"'},{name:"literal",value:'"video"'},{name:"literal",value:'"video-slash"'},{name:"literal",value:'"voice-note"'},{name:"literal",value:'"volume"'},{name:"literal",value:'"volume-low"'},{name:"literal",value:'"volume-mute"'},{name:"literal",value:'"volume-slash"'},{name:"literal",value:'"wallet"'},{name:"literal",value:'"wallet-add"'},{name:"literal",value:'"wallet-check"'},{name:"literal",value:'"wallet-cross"'},{name:"literal",value:'"wallet-fund"'},{name:"literal",value:'"wallet-remove"'},{name:"literal",value:'"wallet-withdraw"'},{name:"literal",value:'"water-drop"'},{name:"literal",value:'"wifi"'},{name:"literal",value:'"wristwatch"'},{name:"literal",value:'"yen"'},{name:"literal",value:'"zoom-in"'},{name:"literal",value:'"zoom-out"'}]}]},description:"Icon displayed to the left — accepts IconName string or ReactNode"},badge:{required:!1,tsType:{name:"union",raw:"string | number",elements:[{name:"string"},{name:"number"}]},description:"Optional count badge displayed on the right"},disabled:{required:!1,tsType:{name:"boolean"},description:"Disabled state",defaultValue:{value:"false",computed:!1}},children:{required:!0,tsType:{name:"ReactNode"},description:""}},composes:["ButtonHTMLAttributes"]};const u=t.forwardRef(({title:a,showDivider:n=!0,children:r,className:s,...c},d)=>{const{collapsed:p,theme:g}=R(),m=C[g];return e.jsxs("div",{ref:d,className:o("flex flex-col",s),...c,children:[a&&!p&&e.jsx("span",{className:o("mb-2 px-4 text-body-xs font-medium uppercase tracking-wider",m.sectionTitle),children:a}),e.jsx("div",{className:"flex flex-col gap-1",role:"menu",children:r}),n&&e.jsx("div",{className:o("mt-3 border-b",m.divider)})]})});u.displayName="SidebarMenuSection";u.__docgenInfo={description:"",methods:[],displayName:"SidebarMenuSection",props:{title:{required:!1,tsType:{name:"string"},description:'Optional section title, e.g. "MAIN MENU"'},showDivider:{required:!1,tsType:{name:"boolean"},description:"Whether to show a divider below the section",defaultValue:{value:"true",computed:!1}},children:{required:!0,tsType:{name:"ReactNode"},description:""}},composes:["HTMLAttributes"]};const $={title:"Elements/SidebarMenu",component:b,tags:["autodocs"]},M={render:()=>{const a=()=>{const[n,r]=t.useState("dashboard");return e.jsx("div",{className:"h-[800px] bg-grey-50 p-6",children:e.jsxs(b,{value:n,onValueChange:r,className:"h-full shadow-soft-xs",children:[e.jsx("div",{className:"mb-3 px-2",children:e.jsx(U,{size:"sm",placeholder:"Search",icon:"search"})}),e.jsxs(u,{title:"Main Menu",children:[e.jsx(l,{value:"dashboard",icon:"grid",children:"Dashboard"}),e.jsx(l,{value:"transactions",icon:"wallet",badge:12,children:"Transactions"}),e.jsx(l,{value:"analytics",icon:"chart",children:"Analytics"}),e.jsx(l,{value:"messages",icon:"message",badge:3,children:"Messages"})]}),e.jsxs(u,{title:"Settings",showDivider:!1,children:[e.jsx(l,{value:"profile",icon:"user",children:"Profile"}),e.jsx(l,{value:"settings",icon:"settings",children:"Settings"}),e.jsx(l,{value:"help",icon:"help-circle",children:"Help Center"})]}),e.jsx("div",{className:"flex-1"}),e.jsxs("div",{className:"flex items-center gap-3 border-t border-grey-100 px-4 pt-4",children:[e.jsx(_,{type:"initials",initials:"JD",size:"md",status:"online"}),e.jsxs("div",{className:"flex flex-1 flex-col",children:[e.jsx("span",{className:"text-body-sm font-semibold text-grey-900",children:"John Doe"}),e.jsx("span",{className:"text-body-xs text-grey-600",children:"john@example.com"})]}),e.jsx("button",{type:"button",className:"flex size-8 cursor-pointer items-center justify-center rounded-md text-grey-400 hover:bg-grey-100",children:e.jsx(D,{name:"sign-out",size:"md"})})]})]})})};return e.jsx(a,{})}},k={render:()=>{const a=()=>{const[n,r]=t.useState("all-projects");return e.jsx("div",{className:"h-[700px] bg-grey-50 p-6",children:e.jsxs(b,{value:n,onValueChange:r,className:"h-full shadow-soft-xs",children:[e.jsxs(u,{title:"Main Menu",children:[e.jsx(l,{value:"dashboard",icon:"grid",children:"Dashboard"}),e.jsxs(l,{value:"projects",icon:"folder",children:["Projects",e.jsxs(j,{children:[e.jsx(f,{value:"all-projects",children:"All Projects"}),e.jsx(f,{value:"active-projects",children:"Active"}),e.jsx(f,{value:"archived-projects",children:"Archived"})]})]}),e.jsxs(l,{value:"team",icon:"users",children:["Team",e.jsxs(j,{children:[e.jsx(f,{value:"members",children:"Members"}),e.jsx(f,{value:"roles",children:"Roles"})]})]}),e.jsx(l,{value:"reports",icon:"chart",badge:5,children:"Reports"})]}),e.jsx(u,{title:"Other",showDivider:!1,children:e.jsx(l,{value:"settings",icon:"settings",children:"Settings"})})]})})};return e.jsx(a,{})}},I={render:()=>{const a=()=>{const[n,r]=t.useState("dashboard");return e.jsx("div",{className:"h-[600px] bg-grey-50 p-6",children:e.jsx(b,{collapsed:!0,value:n,onValueChange:r,className:"h-full shadow-soft-xs",children:e.jsxs(u,{showDivider:!1,children:[e.jsx(l,{value:"dashboard",icon:"grid",children:"Dashboard"}),e.jsx(l,{value:"transactions",icon:"wallet",children:"Transactions"}),e.jsx(l,{value:"analytics",icon:"chart",children:"Analytics"}),e.jsx(l,{value:"messages",icon:"message",children:"Messages"}),e.jsx(l,{value:"settings",icon:"settings",children:"Settings"})]})})})};return e.jsx(a,{})}},N=({theme:a})=>{const[n,r]=t.useState("dashboard");return e.jsxs(b,{theme:a,value:n,onValueChange:r,className:"h-[600px] shadow-soft-xs",children:[e.jsxs(u,{title:"Main Menu",children:[e.jsx(l,{value:"dashboard",icon:"grid",children:"Dashboard"}),e.jsx(l,{value:"transactions",icon:"wallet",badge:12,children:"Transactions"}),e.jsx(l,{value:"analytics",icon:"chart",children:"Analytics"}),e.jsx(l,{value:"messages",icon:"message",badge:3,children:"Messages"})]}),e.jsxs(u,{title:"Settings",showDivider:!1,children:[e.jsx(l,{value:"profile",icon:"user",children:"Profile"}),e.jsx(l,{value:"settings",icon:"settings",children:"Settings"})]}),e.jsx("div",{className:"flex-1"}),e.jsxs("div",{className:"flex items-center gap-3 px-4 pt-4",children:[e.jsx(_,{type:"initials",initials:"AE",size:"md",status:"online"}),e.jsxs("div",{className:"flex flex-1 flex-col",children:[e.jsx("span",{className:a==="light"?"text-body-sm font-semibold text-grey-900":"text-body-sm font-semibold text-white",children:"Alison Eyo"}),e.jsx("span",{className:a==="light"?"text-body-xs text-grey-600":"text-body-xs text-[#E3EFFC]",children:"alison.e@rayna.ui"})]}),e.jsx("button",{type:"button",className:a==="light"?"flex size-8 cursor-pointer items-center justify-center rounded-md text-grey-400 hover:bg-grey-100":"flex size-8 cursor-pointer items-center justify-center rounded-md text-white/70 hover:text-white",children:e.jsx(D,{name:"sign-out",size:"md"})})]})]})},T={render:()=>e.jsxs("div",{className:"flex gap-6 bg-grey-50 p-6",children:[e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx("span",{className:"text-body-xs font-medium text-grey-500",children:"Light"}),e.jsx(N,{theme:"light"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx("span",{className:"text-body-xs font-medium text-grey-500",children:"Blue"}),e.jsx(N,{theme:"blue"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx("span",{className:"text-body-xs font-medium text-grey-500",children:"Dark Blue"}),e.jsx(N,{theme:"dark-blue"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx("span",{className:"text-body-xs font-medium text-grey-500",children:"Dark Grey"}),e.jsx(N,{theme:"dark-grey"})]})]})},A={render:()=>{const a=()=>{const[n,r]=t.useState("dashboard"),[s,c]=t.useState(!1);return e.jsxs("div",{className:"flex h-[700px] gap-4 bg-grey-50 p-6",children:[e.jsxs(b,{collapsed:s,value:n,onValueChange:r,className:"h-full shadow-soft-xs transition-all duration-200",children:[e.jsx("button",{type:"button",onClick:()=>c(d=>!d),className:"mb-2 flex cursor-pointer items-center justify-center self-end rounded-md p-2 text-grey-400 hover:bg-grey-100",children:e.jsx(D,{name:s?"chevron-right":"chevron-left",size:"md"})}),e.jsxs(u,{title:"Main Menu",children:[e.jsx(l,{value:"dashboard",icon:"grid",children:"Dashboard"}),e.jsx(l,{value:"transactions",icon:"wallet",badge:12,children:"Transactions"}),e.jsx(l,{value:"analytics",icon:"chart",children:"Analytics"}),e.jsx(l,{value:"messages",icon:"message",badge:3,children:"Messages"})]}),e.jsxs(u,{title:"Settings",showDivider:!1,children:[e.jsx(l,{value:"profile",icon:"user",children:"Profile"}),e.jsx(l,{value:"settings",icon:"settings",children:"Settings"})]})]}),e.jsxs("div",{className:"flex-1 rounded-xl bg-white p-8 shadow-soft-xs",children:[e.jsx("h2",{className:"text-h4 font-semibold text-grey-900",children:n.charAt(0).toUpperCase()+n.slice(1)}),e.jsxs("p",{className:"mt-2 text-body-md text-grey-600",children:["Selected menu item: ",e.jsx("strong",{children:n})]})]})]})};return e.jsx(a,{})}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  render: () => {
    const SidebarDemo = () => {
      const [active, setActive] = useState("dashboard");
      return <div className="h-[800px] bg-grey-50 p-6">
          <SidebarMenu value={active} onValueChange={setActive} className="h-full shadow-soft-xs">
            {/* Search */}
            <div className="mb-3 px-2">
              <Input size="sm" placeholder="Search" icon="search" />
            </div>

            {/* Main Menu */}
            <SidebarMenuSection title="Main Menu">
              <SidebarMenuItem value="dashboard" icon="grid">
                Dashboard
              </SidebarMenuItem>
              <SidebarMenuItem value="transactions" icon="wallet" badge={12}>
                Transactions
              </SidebarMenuItem>
              <SidebarMenuItem value="analytics" icon="chart">
                Analytics
              </SidebarMenuItem>
              <SidebarMenuItem value="messages" icon="message" badge={3}>
                Messages
              </SidebarMenuItem>
            </SidebarMenuSection>

            {/* Settings Section */}
            <SidebarMenuSection title="Settings" showDivider={false}>
              <SidebarMenuItem value="profile" icon="user">
                Profile
              </SidebarMenuItem>
              <SidebarMenuItem value="settings" icon="settings">
                Settings
              </SidebarMenuItem>
              <SidebarMenuItem value="help" icon="help-circle">
                Help Center
              </SidebarMenuItem>
            </SidebarMenuSection>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Footer user card */}
            <div className="flex items-center gap-3 border-t border-grey-100 px-4 pt-4">
              <Avatar type="initials" initials="JD" size="md" status="online" />
              <div className="flex flex-1 flex-col">
                <span className="text-body-sm font-semibold text-grey-900">
                  John Doe
                </span>
                <span className="text-body-xs text-grey-600">
                  john@example.com
                </span>
              </div>
              <button type="button" className="flex size-8 cursor-pointer items-center justify-center rounded-md text-grey-400 hover:bg-grey-100">
                <Icon name="sign-out" size="md" />
              </button>
            </div>
          </SidebarMenu>
        </div>;
    };
    return <SidebarDemo />;
  }
}`,...M.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  render: () => {
    const SidebarSubDemo = () => {
      const [active, setActive] = useState("all-projects");
      return <div className="h-[700px] bg-grey-50 p-6">
          <SidebarMenu value={active} onValueChange={setActive} className="h-full shadow-soft-xs">
            <SidebarMenuSection title="Main Menu">
              <SidebarMenuItem value="dashboard" icon="grid">
                Dashboard
              </SidebarMenuItem>
              <SidebarMenuItem value="projects" icon="folder">
                Projects
                <SidebarMenuSub>
                  <SidebarMenuSubItem value="all-projects">
                    All Projects
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem value="active-projects">
                    Active
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem value="archived-projects">
                    Archived
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
              <SidebarMenuItem value="team" icon="users">
                Team
                <SidebarMenuSub>
                  <SidebarMenuSubItem value="members">
                    Members
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem value="roles">
                    Roles
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
              <SidebarMenuItem value="reports" icon="chart" badge={5}>
                Reports
              </SidebarMenuItem>
            </SidebarMenuSection>

            <SidebarMenuSection title="Other" showDivider={false}>
              <SidebarMenuItem value="settings" icon="settings">
                Settings
              </SidebarMenuItem>
            </SidebarMenuSection>
          </SidebarMenu>
        </div>;
    };
    return <SidebarSubDemo />;
  }
}`,...k.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  render: () => {
    const SidebarCollapsedDemo = () => {
      const [active, setActive] = useState("dashboard");
      return <div className="h-[600px] bg-grey-50 p-6">
          <SidebarMenu collapsed value={active} onValueChange={setActive} className="h-full shadow-soft-xs">
            <SidebarMenuSection showDivider={false}>
              <SidebarMenuItem value="dashboard" icon="grid">
                Dashboard
              </SidebarMenuItem>
              <SidebarMenuItem value="transactions" icon="wallet">
                Transactions
              </SidebarMenuItem>
              <SidebarMenuItem value="analytics" icon="chart">
                Analytics
              </SidebarMenuItem>
              <SidebarMenuItem value="messages" icon="message">
                Messages
              </SidebarMenuItem>
              <SidebarMenuItem value="settings" icon="settings">
                Settings
              </SidebarMenuItem>
            </SidebarMenuSection>
          </SidebarMenu>
        </div>;
    };
    return <SidebarCollapsedDemo />;
  }
}`,...I.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex gap-6 bg-grey-50 p-6">
      <div className="flex flex-col items-center gap-2">
        <span className="text-body-xs font-medium text-grey-500">Light</span>
        <ThemeSidebar theme="light" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-body-xs font-medium text-grey-500">Blue</span>
        <ThemeSidebar theme="blue" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-body-xs font-medium text-grey-500">Dark Blue</span>
        <ThemeSidebar theme="dark-blue" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-body-xs font-medium text-grey-500">Dark Grey</span>
        <ThemeSidebar theme="dark-grey" />
      </div>
    </div>
}`,...T.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  render: () => {
    const ToggleDemo = () => {
      const [active, setActive] = useState("dashboard");
      const [collapsed, setCollapsed] = useState(false);
      return <div className="flex h-[700px] gap-4 bg-grey-50 p-6">
          <SidebarMenu collapsed={collapsed} value={active} onValueChange={setActive} className="h-full shadow-soft-xs transition-all duration-200">
            {/* Toggle button */}
            <button type="button" onClick={() => setCollapsed(c => !c)} className="mb-2 flex cursor-pointer items-center justify-center self-end rounded-md p-2 text-grey-400 hover:bg-grey-100">
              <Icon name={collapsed ? "chevron-right" : "chevron-left"} size="md" />
            </button>

            <SidebarMenuSection title="Main Menu">
              <SidebarMenuItem value="dashboard" icon="grid">
                Dashboard
              </SidebarMenuItem>
              <SidebarMenuItem value="transactions" icon="wallet" badge={12}>
                Transactions
              </SidebarMenuItem>
              <SidebarMenuItem value="analytics" icon="chart">
                Analytics
              </SidebarMenuItem>
              <SidebarMenuItem value="messages" icon="message" badge={3}>
                Messages
              </SidebarMenuItem>
            </SidebarMenuSection>

            <SidebarMenuSection title="Settings" showDivider={false}>
              <SidebarMenuItem value="profile" icon="user">
                Profile
              </SidebarMenuItem>
              <SidebarMenuItem value="settings" icon="settings">
                Settings
              </SidebarMenuItem>
            </SidebarMenuSection>
          </SidebarMenu>

          {/* Content area */}
          <div className="flex-1 rounded-xl bg-white p-8 shadow-soft-xs">
            <h2 className="text-h4 font-semibold text-grey-900">
              {active.charAt(0).toUpperCase() + active.slice(1)}
            </h2>
            <p className="mt-2 text-body-md text-grey-600">
              Selected menu item: <strong>{active}</strong>
            </p>
          </div>
        </div>;
    };
    return <ToggleDemo />;
  }
}`,...A.parameters?.docs?.source}}};const ee=["Default","WithSubItems","Collapsed","AllThemes","CollapsibleToggle"];export{T as AllThemes,I as Collapsed,A as CollapsibleToggle,M as Default,k as WithSubItems,ee as __namedExportsOrder,$ as default};
