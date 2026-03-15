import{j as e}from"./jsx-runtime-u17CrQMm.js";import{r as A}from"./iframe-g5PiM8Jh.js";import{c as l}from"./cn-C8nBGPD0.js";import{I as _}from"./Input-Cde_iS42.js";import{I as z}from"./Icon-CxPrjGB-.js";import"./preload-helper-PPVm8Dsz.js";import"./resolveIcon-B4eesLNI.js";function I({link:a,dark:i,large:c}){return e.jsxs("button",{type:"button",onClick:a.onClick,className:l("flex items-center gap-2 font-semibold whitespace-nowrap transition-colors",c?"text-base":"text-sm",i?"text-grey-400 hover:text-grey-50":"text-grey-900 hover:text-grey-700"),children:[a.label,a.dot&&e.jsx("span",{className:"size-2 rounded-full bg-primary-400 shrink-0"}),a.hasDropdown&&e.jsx(z,{name:"chevron-down",size:"xs",className:i?"text-grey-400":"text-grey-900"})]})}function p({links:a,dark:i,large:c,gap:m="gap-6",className:b}){return a.length===0?null:e.jsx("div",{className:l("flex items-center",m,b),children:a.map(d=>e.jsx(I,{link:d,dark:i,large:c},d.label))})}function t({variant:a=1,logo:i,links:c=[],rightLinks:m=[],actions:b=[],announcement:d,searchPlaceholder:q="Search for components...",onSearch:T,switcher:u,secondaryLinks:W=[],className:N}){const[U,G]=A.useState(""),[D,B]=A.useState(u?.activeIndex??0),o=a===4||a===8,C=[3,4,5,6,9,10,11].includes(a),F=[5,6,7,8,9,10].includes(a);function M(r,n){const H=F?"rounded-2xl":"rounded-lg";if(r.variant==="text")return e.jsx("button",{type:"button",onClick:r.onClick,className:l("text-sm font-semibold whitespace-nowrap",o?"text-grey-50":"text-primary-400"),children:r.label},n);if(r.variant==="secondary")return a===5?e.jsx("button",{type:"button",onClick:r.onClick,className:"px-6 py-4 font-semibold text-base text-primary-400 bg-primary-50 rounded-2xl whitespace-nowrap",children:r.label},n):a===8?e.jsx("button",{type:"button",onClick:r.onClick,className:"px-4 py-2 font-semibold text-sm text-grey-50 bg-grey-700 rounded-2xl whitespace-nowrap",children:r.label},n):a===11?e.jsx("button",{type:"button",onClick:r.onClick,className:"px-6 py-4 font-semibold text-base text-primary-600 bg-white border-[1.5px] border-primary-600 rounded-lg whitespace-nowrap",children:r.label},n):e.jsx("button",{type:"button",onClick:r.onClick,className:l("px-4 py-2 font-semibold text-sm text-primary-500 border-[1.5px] border-primary-500 bg-white whitespace-nowrap",H),children:r.label},n);const V=[3,4,5,11].includes(a);return e.jsx("button",{type:"button",onClick:r.onClick,className:l("font-semibold text-white bg-primary-500 whitespace-nowrap",V?"px-6 py-4 text-base":"px-4 py-2 text-sm",a===3||a===4?"rounded-full":H),children:r.label},n)}const P=b.length>0&&e.jsx("div",{className:"flex items-center gap-6 shrink-0",children:b.map((r,n)=>M(r,n))});function R(){return u?a===11?e.jsx("div",{className:"flex items-center gap-6",children:u.tabs.map((r,n)=>e.jsx("button",{type:"button",onClick:()=>{B(n),u.onChange?.(n)},className:l("px-4 py-2 text-sm font-semibold rounded-lg whitespace-nowrap",n===D?"bg-primary-50 text-primary-400":"text-grey-400"),children:r},r))}):e.jsx("div",{className:"flex items-center",children:u.tabs.map((r,n)=>e.jsx("button",{type:"button",onClick:()=>{B(n),u.onChange?.(n)},className:l("px-4 py-2.5 text-sm whitespace-nowrap",n===0&&"rounded-l-lg",n===u.tabs.length-1&&"rounded-r-lg",n===D?"bg-white border border-grey-200 font-semibold text-info-500":"bg-grey-200 font-medium text-grey-400"),children:r},r))}):null}function E(){return e.jsx("div",{className:l("flex items-center gap-8 rounded-full px-10 py-4",o?"bg-[#292424]":"bg-grey-75"),children:c.map(r=>e.jsx(I,{link:r,dark:o,large:!0},r.label))})}return a===11?e.jsxs("div",{className:l("flex flex-col bg-white w-full",N),children:[e.jsxs("div",{className:"flex items-center justify-between px-[72px] py-6",children:[R(),e.jsx("div",{className:"flex items-center gap-6",children:W.map(r=>e.jsx("button",{type:"button",onClick:r.onClick,className:"text-sm font-semibold text-grey-400 hover:text-grey-600 whitespace-nowrap",children:r.label},r.label))})]}),e.jsx("div",{className:"h-px w-full bg-grey-200"}),e.jsxs("div",{className:"flex items-center justify-between px-[72px] py-6",children:[e.jsxs("div",{className:"flex items-center gap-10",children:[i,e.jsx(p,{links:c,large:!0,gap:"gap-8"})]}),P]})]}):a===7||a===8?e.jsx("div",{className:l("flex flex-col w-full",o?"bg-grey-900":"bg-white",N),children:e.jsxs("div",{className:"flex items-center justify-between px-[72px] py-6 w-full",children:[e.jsx(p,{links:c,dark:o}),i,e.jsxs("div",{className:"flex items-center gap-6",children:[e.jsx(p,{links:m,dark:o}),P]})]})}):e.jsxs("div",{className:l("flex flex-col w-full",o?"bg-grey-900":"bg-white",N),children:[a===1&&d&&e.jsxs("div",{className:"flex items-center justify-center gap-2 bg-[#290b00] px-4 py-4 w-full",children:[e.jsx("span",{className:"text-xs text-white",children:d.text}),d.linkLabel&&e.jsx("button",{type:"button",onClick:d.onLinkClick,className:"text-xs font-semibold text-warning-400",children:d.linkLabel})]}),e.jsxs("div",{className:l("flex items-center justify-between py-6 w-full",a===3||a===4?"px-[112px]":"px-[72px]"),children:[e.jsxs("div",{className:"flex items-center gap-10 shrink-0",children:[i,a===9&&e.jsx(_,{size:"sm",placeholder:q,leadingIcon:"search",value:U,onChange:r=>{G(r.target.value),T?.(r.target.value)},wrapperClassName:"w-[375px]"}),a===10&&R()]}),a===3||a===4?E():e.jsx(p,{links:c,dark:o,large:C}),e.jsxs("div",{className:"flex items-center gap-6 shrink-0",children:[e.jsx(p,{links:m,dark:o,large:C}),P]})]})]})}t.__docgenInfo={description:"",methods:[],displayName:"HeaderBlock",props:{variant:{required:!1,tsType:{name:"union",raw:"1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11",elements:[{name:"literal",value:"1"},{name:"literal",value:"2"},{name:"literal",value:"3"},{name:"literal",value:"4"},{name:"literal",value:"5"},{name:"literal",value:"6"},{name:"literal",value:"7"},{name:"literal",value:"8"},{name:"literal",value:"9"},{name:"literal",value:"10"},{name:"literal",value:"11"}]},description:"Visual variant (1-11)",defaultValue:{value:"1",computed:!1}},logo:{required:!1,tsType:{name:"ReactNode"},description:"Logo element"},links:{required:!1,tsType:{name:"Array",elements:[{name:"HeaderBlockLink"}],raw:"HeaderBlockLink[]"},description:"Navigation links (center or left side for centered-logo variants)",defaultValue:{value:"[]",computed:!1}},rightLinks:{required:!1,tsType:{name:"Array",elements:[{name:"HeaderBlockLink"}],raw:"HeaderBlockLink[]"},description:"Right-side navigation links (for centered-logo variants 7, 8 and variant 9)",defaultValue:{value:"[]",computed:!1}},actions:{required:!1,tsType:{name:"Array",elements:[{name:"HeaderBlockAction"}],raw:"HeaderBlockAction[]"},description:"Action buttons (far right)",defaultValue:{value:"[]",computed:!1}},announcement:{required:!1,tsType:{name:"HeaderBlockAnnouncement"},description:"Announcement banner (variant 1)"},searchPlaceholder:{required:!1,tsType:{name:"string"},description:"Search input placeholder (variant 9)",defaultValue:{value:'"Search for components..."',computed:!1}},onSearch:{required:!1,tsType:{name:"signature",type:"function",raw:"(query: string) => void",signature:{arguments:[{type:{name:"string"},name:"query"}],return:{name:"void"}}},description:"Search handler"},switcher:{required:!1,tsType:{name:"HeaderBlockSwitcher"},description:"Switcher tabs (variants 10-11)"},secondaryLinks:{required:!1,tsType:{name:"Array",elements:[{name:"HeaderBlockLink"}],raw:"HeaderBlockLink[]"},description:"Policy / secondary links for variant 11 top row",defaultValue:{value:"[]",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"Additional class names"}}};const Z={title:"Blocks/Header",component:t,tags:["autodocs"]},s=({light:a=!1})=>e.jsxs("span",{className:`text-xl font-bold whitespace-nowrap ${a?"text-white":"text-grey-900"}`,children:[e.jsx("span",{className:"text-primary-400",children:"R"})," rayna UI"]}),g={render:()=>e.jsx(t,{variant:1,logo:e.jsx(s,{}),announcement:{text:"Rayna UI is now features on Product Hunt!",linkLabel:"Support Us"},links:[{label:"Solutions",hasDropdown:!0},{label:"How it works"},{label:"About",hasDropdown:!0},{label:"Resources"}],actions:[{label:"Get Started",variant:"primary"}]})},x={render:()=>e.jsx(t,{variant:2,logo:e.jsx(s,{}),links:[{label:"Use Cases"},{label:"Pricing"},{label:"Partners"},{label:"Affiliates"},{label:"Customers"},{label:"Blog"},{label:"Resources",hasDropdown:!0}],actions:[{label:"Login",variant:"text"},{label:"Get Started",variant:"primary"}]})},h={render:()=>e.jsx(t,{variant:3,logo:e.jsx(s,{}),links:[{label:"Use Cases",hasDropdown:!0},{label:"Resources",hasDropdown:!0},{label:"Pricing"},{label:"What's New?",dot:!0}],actions:[{label:"Book a Demo",variant:"primary"}]})},y={render:()=>e.jsx(t,{variant:4,logo:e.jsx(s,{light:!0}),links:[{label:"Use Cases",hasDropdown:!0},{label:"Resources",hasDropdown:!0},{label:"Pricing"},{label:"What's New?",dot:!0}],actions:[{label:"Book a Demo",variant:"primary"}]})},f={render:()=>e.jsx(t,{variant:5,logo:e.jsx(s,{}),links:[{label:"Product",hasDropdown:!0},{label:"Partnerships",hasDropdown:!0},{label:"Pricing"},{label:"Company",hasDropdown:!0}],actions:[{label:"Sign In",variant:"secondary"},{label:"Get Started",variant:"primary"}]})},v={render:()=>e.jsx(t,{variant:6,logo:e.jsx(s,{}),links:[{label:"Product",hasDropdown:!0},{label:"Platform",hasDropdown:!0},{label:"Fees",hasDropdown:!0},{label:"EN",hasDropdown:!0}],actions:[{label:"Register",variant:"text"},{label:"Login",variant:"primary"}]})},w={render:()=>e.jsx(t,{variant:7,logo:e.jsx(s,{}),links:[{label:"Solutions"},{label:"Investments"}],rightLinks:[{label:"Meet Rayna"},{label:"Resources"}],actions:[{label:"Log in",variant:"text"},{label:"Get Started",variant:"primary"}]})},k={render:()=>e.jsx(t,{variant:8,logo:e.jsx(s,{light:!0}),links:[{label:"Find talent"},{label:"For designers"},{label:"Inspiration"},{label:"Learn Design"},{label:"Go Pro"}],rightLinks:[{label:"Meet Rayna"},{label:"Resources"}],actions:[{label:"Sign up",variant:"secondary"},{label:"Post a job",variant:"primary"}]})},j={render:()=>e.jsx(t,{variant:9,logo:e.jsx(s,{}),searchPlaceholder:"Search for components...",onSearch:a=>console.log("Search:",a),rightLinks:[{label:"About"},{label:"Partners"}],actions:[{label:"Sign in",variant:"text"},{label:"Post a job",variant:"primary"}]})},S={render:()=>e.jsx(t,{variant:10,logo:e.jsx(s,{}),switcher:{tabs:["Personal","Business"],activeIndex:0},links:[{label:"Product",hasDropdown:!0},{label:"Platform",hasDropdown:!0},{label:"Fees",hasDropdown:!0},{label:"EN",hasDropdown:!0}],actions:[{label:"Register",variant:"text"},{label:"Login",variant:"primary"}]})},L={render:()=>e.jsx(t,{variant:11,logo:e.jsx(s,{}),switcher:{tabs:["Personal","Business"],activeIndex:0},secondaryLinks:[{label:"Privacy Policy"},{label:"Terms of Use"}],links:[{label:"Money"},{label:"Wealth"},{label:"Plans"},{label:"More"}],actions:[{label:"Login",variant:"secondary"},{label:"Sign up",variant:"primary"}]})};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <HeaderBlock variant={1} logo={<Logo />} announcement={{
    text: "Rayna UI is now features on Product Hunt!",
    linkLabel: "Support Us"
  }} links={[{
    label: "Solutions",
    hasDropdown: true
  }, {
    label: "How it works"
  }, {
    label: "About",
    hasDropdown: true
  }, {
    label: "Resources"
  }]} actions={[{
    label: "Get Started",
    variant: "primary"
  }]} />
}`,...g.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <HeaderBlock variant={2} logo={<Logo />} links={[{
    label: "Use Cases"
  }, {
    label: "Pricing"
  }, {
    label: "Partners"
  }, {
    label: "Affiliates"
  }, {
    label: "Customers"
  }, {
    label: "Blog"
  }, {
    label: "Resources",
    hasDropdown: true
  }]} actions={[{
    label: "Login",
    variant: "text"
  }, {
    label: "Get Started",
    variant: "primary"
  }]} />
}`,...x.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <HeaderBlock variant={3} logo={<Logo />} links={[{
    label: "Use Cases",
    hasDropdown: true
  }, {
    label: "Resources",
    hasDropdown: true
  }, {
    label: "Pricing"
  }, {
    label: "What's New?",
    dot: true
  }]} actions={[{
    label: "Book a Demo",
    variant: "primary"
  }]} />
}`,...h.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <HeaderBlock variant={4} logo={<Logo light />} links={[{
    label: "Use Cases",
    hasDropdown: true
  }, {
    label: "Resources",
    hasDropdown: true
  }, {
    label: "Pricing"
  }, {
    label: "What's New?",
    dot: true
  }]} actions={[{
    label: "Book a Demo",
    variant: "primary"
  }]} />
}`,...y.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <HeaderBlock variant={5} logo={<Logo />} links={[{
    label: "Product",
    hasDropdown: true
  }, {
    label: "Partnerships",
    hasDropdown: true
  }, {
    label: "Pricing"
  }, {
    label: "Company",
    hasDropdown: true
  }]} actions={[{
    label: "Sign In",
    variant: "secondary"
  }, {
    label: "Get Started",
    variant: "primary"
  }]} />
}`,...f.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <HeaderBlock variant={6} logo={<Logo />} links={[{
    label: "Product",
    hasDropdown: true
  }, {
    label: "Platform",
    hasDropdown: true
  }, {
    label: "Fees",
    hasDropdown: true
  }, {
    label: "EN",
    hasDropdown: true
  }]} actions={[{
    label: "Register",
    variant: "text"
  }, {
    label: "Login",
    variant: "primary"
  }]} />
}`,...v.parameters?.docs?.source}}};w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: () => <HeaderBlock variant={7} logo={<Logo />} links={[{
    label: "Solutions"
  }, {
    label: "Investments"
  }]} rightLinks={[{
    label: "Meet Rayna"
  }, {
    label: "Resources"
  }]} actions={[{
    label: "Log in",
    variant: "text"
  }, {
    label: "Get Started",
    variant: "primary"
  }]} />
}`,...w.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  render: () => <HeaderBlock variant={8} logo={<Logo light />} links={[{
    label: "Find talent"
  }, {
    label: "For designers"
  }, {
    label: "Inspiration"
  }, {
    label: "Learn Design"
  }, {
    label: "Go Pro"
  }]} rightLinks={[{
    label: "Meet Rayna"
  }, {
    label: "Resources"
  }]} actions={[{
    label: "Sign up",
    variant: "secondary"
  }, {
    label: "Post a job",
    variant: "primary"
  }]} />
}`,...k.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  render: () => <HeaderBlock variant={9} logo={<Logo />} searchPlaceholder="Search for components..." onSearch={q => console.log("Search:", q)} rightLinks={[{
    label: "About"
  }, {
    label: "Partners"
  }]} actions={[{
    label: "Sign in",
    variant: "text"
  }, {
    label: "Post a job",
    variant: "primary"
  }]} />
}`,...j.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => <HeaderBlock variant={10} logo={<Logo />} switcher={{
    tabs: ["Personal", "Business"],
    activeIndex: 0
  }} links={[{
    label: "Product",
    hasDropdown: true
  }, {
    label: "Platform",
    hasDropdown: true
  }, {
    label: "Fees",
    hasDropdown: true
  }, {
    label: "EN",
    hasDropdown: true
  }]} actions={[{
    label: "Register",
    variant: "text"
  }, {
    label: "Login",
    variant: "primary"
  }]} />
}`,...S.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  render: () => <HeaderBlock variant={11} logo={<Logo />} switcher={{
    tabs: ["Personal", "Business"],
    activeIndex: 0
  }} secondaryLinks={[{
    label: "Privacy Policy"
  }, {
    label: "Terms of Use"
  }]} links={[{
    label: "Money"
  }, {
    label: "Wealth"
  }, {
    label: "Plans"
  }, {
    label: "More"
  }]} actions={[{
    label: "Login",
    variant: "secondary"
  }, {
    label: "Sign up",
    variant: "primary"
  }]} />
}`,...L.parameters?.docs?.source}}};const ee=["WithAnnouncement","Standard","PillNav","DarkPillNav","RoundedButtons","WithLanguage","CenteredLogo","DarkBackground","WithSearch","WithSwitcher","DoubleRow"];export{w as CenteredLogo,k as DarkBackground,y as DarkPillNav,L as DoubleRow,h as PillNav,f as RoundedButtons,x as Standard,g as WithAnnouncement,v as WithLanguage,j as WithSearch,S as WithSwitcher,ee as __namedExportsOrder,Z as default};
