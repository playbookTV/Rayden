import{j as r}from"./jsx-runtime-u17CrQMm.js";import{c as n}from"./cn-C8nBGPD0.js";import{r as u}from"./resolveIcon-B4eesLNI.js";import"./Icon-CxPrjGB-.js";import"./iframe-g5PiM8Jh.js";import"./preload-helper-PPVm8Dsz.js";function o({items:c,separator:i="/",className:m,...d}){return r.jsx("nav",{"aria-label":"Breadcrumb",className:n("border-y border-grey-200 px-4 py-2.5",m),...d,children:r.jsx("ol",{className:"flex items-center gap-2 text-sm",children:c.map((e,l)=>r.jsxs("li",{className:"flex items-center gap-2",children:[l>0&&r.jsx("span",{className:"text-grey-400","aria-hidden":!0,children:i}),e.icon&&r.jsx("span",{className:"size-4 shrink-0",children:u(e.icon,"sm")}),e.href&&!e.disabled&&!e.active?r.jsx("a",{href:e.href,className:n("text-grey-500 hover:text-primary-300 transition-colors"),children:e.label}):r.jsx("span",{className:n(e.active&&"text-primary-500 font-medium",e.disabled&&"text-grey-400 cursor-not-allowed",!e.active&&!e.disabled&&"text-grey-500"),"aria-current":e.active?"page":void 0,children:e.label})]},l))})})}o.__docgenInfo={description:"",methods:[],displayName:"Breadcrumb",props:{items:{required:!0,tsType:{name:"Array",elements:[{name:"BreadcrumbItem"}],raw:"BreadcrumbItem[]"},description:""},separator:{required:!1,tsType:{name:"ReactNode"},description:"",defaultValue:{value:'"/"',computed:!1}}},composes:["HTMLAttributes"]};const y={title:"Components/Breadcrumb",component:o,tags:["autodocs"]},a={args:{items:[{label:"Home",href:"#"},{label:"Settings",href:"#"},{label:"Profile",active:!0}]}},s={args:{items:[{label:"Home",href:"#"},{label:"Archived",disabled:!0},{label:"Detail",active:!0}]}},t={args:{items:[{label:"Home",href:"#"},{label:"Products",href:"#"},{label:"Category",href:"#"},{label:"Subcategory",href:"#"},{label:"Item",active:!0}]}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      label: "Home",
      href: "#"
    }, {
      label: "Settings",
      href: "#"
    }, {
      label: "Profile",
      active: true
    }]
  }
}`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      label: "Home",
      href: "#"
    }, {
      label: "Archived",
      disabled: true
    }, {
      label: "Detail",
      active: true
    }]
  }
}`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      label: "Home",
      href: "#"
    }, {
      label: "Products",
      href: "#"
    }, {
      label: "Category",
      href: "#"
    }, {
      label: "Subcategory",
      href: "#"
    }, {
      label: "Item",
      active: true
    }]
  }
}`,...t.parameters?.docs?.source}}};const v=["Default","WithDisabled","ManyItems"];export{a as Default,t as ManyItems,s as WithDisabled,v as __namedExportsOrder,y as default};
