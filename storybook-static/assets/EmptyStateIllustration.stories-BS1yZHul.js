import{j as e}from"./jsx-runtime-u17CrQMm.js";import{E as a,i as x}from"./EmptyStateIllustration-BhxgoUOB.js";import"./iframe-g5PiM8Jh.js";import"./preload-helper-PPVm8Dsz.js";import"./cn-C8nBGPD0.js";const y={title:"Components/EmptyStateIllustration",component:a,tags:["autodocs"]},t={render:()=>e.jsx("div",{className:"flex flex-wrap gap-6 p-6",children:x.map(s=>e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(a,{name:s,colored:!0}),e.jsx("span",{className:"text-body-xs text-grey-500",children:s})]},s))})},l={render:()=>e.jsx("div",{className:"flex flex-wrap gap-6 p-6",children:x.map(s=>e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(a,{name:s,colored:!1}),e.jsx("span",{className:"text-body-xs text-grey-500",children:s})]},s))})},r={render:()=>e.jsx("div",{className:"flex flex-wrap gap-8 p-6",children:x.map(s=>e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsxs("div",{className:"flex gap-2",children:[e.jsx(a,{name:s,colored:!0}),e.jsx(a,{name:s,colored:!1})]}),e.jsx("span",{className:"text-body-xs text-grey-500",children:s})]},s))})},o=["#E5F0FF","#C2D8FC","#9ABCFC","#74A0FA","#4A85F7","#3066F5","#1750EB","#0C40CC","#0733AD","#02288F","#001E71"],n={render:()=>e.jsxs("div",{className:"flex flex-wrap gap-6 p-6",children:[e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(a,{name:"inbox",colored:!0}),e.jsx("span",{className:"text-body-xs text-grey-500",children:"Default"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(a,{name:"inbox",colored:!0,palette:o}),e.jsx("span",{className:"text-body-xs text-grey-500",children:"Blue palette"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(a,{name:"inbox",colored:!1}),e.jsx("span",{className:"text-body-xs text-grey-500",children:"Grey"})]})]})},c={render:()=>e.jsxs("div",{className:"flex items-end gap-6 p-6",children:[e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(a,{name:"search",size:80}),e.jsx("span",{className:"text-body-xs text-grey-500",children:"80px"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(a,{name:"search",size:120}),e.jsx("span",{className:"text-body-xs text-grey-500",children:"120px"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(a,{name:"search",size:150}),e.jsx("span",{className:"text-body-xs text-grey-500",children:"150px (default)"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(a,{name:"search",size:200}),e.jsx("span",{className:"text-body-xs text-grey-500",children:"200px"})]})]})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-6 p-6">
      {illustrationNames.map(name => <div key={name} className="flex flex-col items-center gap-2">
          <EmptyStateIllustration name={name} colored />
          <span className="text-body-xs text-grey-500">{name}</span>
        </div>)}
    </div>
}`,...t.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-6 p-6">
      {illustrationNames.map(name => <div key={name} className="flex flex-col items-center gap-2">
          <EmptyStateIllustration name={name} colored={false} />
          <span className="text-body-xs text-grey-500">{name}</span>
        </div>)}
    </div>
}`,...l.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-8 p-6">
      {illustrationNames.map(name => <div key={name} className="flex flex-col items-center gap-2">
          <div className="flex gap-2">
            <EmptyStateIllustration name={name} colored />
            <EmptyStateIllustration name={name} colored={false} />
          </div>
          <span className="text-body-xs text-grey-500">{name}</span>
        </div>)}
    </div>
}`,...r.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-6 p-6">
      <div className="flex flex-col items-center gap-2">
        <EmptyStateIllustration name="inbox" colored />
        <span className="text-body-xs text-grey-500">Default</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <EmptyStateIllustration name="inbox" colored palette={bluePalette} />
        <span className="text-body-xs text-grey-500">Blue palette</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <EmptyStateIllustration name="inbox" colored={false} />
        <span className="text-body-xs text-grey-500">Grey</span>
      </div>
    </div>
}`,...n.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-end gap-6 p-6">
      <div className="flex flex-col items-center gap-2">
        <EmptyStateIllustration name="search" size={80} />
        <span className="text-body-xs text-grey-500">80px</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <EmptyStateIllustration name="search" size={120} />
        <span className="text-body-xs text-grey-500">120px</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <EmptyStateIllustration name="search" size={150} />
        <span className="text-body-xs text-grey-500">150px (default)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <EmptyStateIllustration name="search" size={200} />
        <span className="text-body-xs text-grey-500">200px</span>
      </div>
    </div>
}`,...c.parameters?.docs?.source}}};const g=["AllColored","AllGrey","ColoredVsGrey","CustomPalette","Sizes"];export{t as AllColored,l as AllGrey,r as ColoredVsGrey,n as CustomPalette,c as Sizes,g as __namedExportsOrder,y as default};
