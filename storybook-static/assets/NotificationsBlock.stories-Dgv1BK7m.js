import{j as e}from"./jsx-runtime-u17CrQMm.js";import{c as l}from"./cn-C8nBGPD0.js";import{A as d,a as r}from"./ActivityContent-CtuMktmN.js";import{B as g}from"./Badge-_vRqbRhl.js";import{A as n}from"./Avatar-BvmkuJdv.js";import"./iframe-g5PiM8Jh.js";import"./preload-helper-PPVm8Dsz.js";import"./resolveIcon-B4eesLNI.js";import"./Icon-CxPrjGB-.js";function m({title:c="Notifications",unreadCount:s,items:a,className:o}){return e.jsxs("div",{className:l("bg-white rounded-xl shadow-[0px_3px_2px_-2px_rgba(0,0,0,0.06),0px_5px_3px_-2px_rgba(0,0,0,0.02)] pt-4 pb-8 overflow-clip",o),children:[e.jsxs("div",{className:"px-6 py-1.5 flex items-center gap-2",children:[e.jsx("h3",{className:"flex-1 text-lg font-semibold text-grey-700",children:c}),s!=null&&s>0&&e.jsxs(g,{color:"success",type:"accent",size:"sm",children:[s," unread"]})]}),e.jsx("div",{className:"flex flex-col gap-4 px-6 mt-6",children:a.map((t,p)=>(a.length-1,a.length>1&&a.length>2,e.jsx("div",{children:e.jsxs(d,{avatar:t.avatar,text:t.text,date:t.date,time:t.time,unread:t.unread,link:t.link,badge:t.badge,children:[t.content?.type==="file"&&e.jsx(r,{variant:"file",contentStyle:"container",title:t.content.title,size:t.content.size,fileType:t.content.fileType,date:t.content.date}),t.content?.type==="comment"&&e.jsx(r,{variant:"comment",contentStyle:"container",avatar:t.content.avatar,author:t.content.author,timestamp:t.content.timestamp,comment:t.content.comment,reactions:t.content.reactions,replies:t.content.replies}),t.content?.type==="cta"&&e.jsx(r,{variant:"cta",primaryAction:t.content.primaryAction,secondaryAction:t.content.secondaryAction})]})},t.id)))})]})}m.__docgenInfo={description:"",methods:[],displayName:"NotificationsBlock",props:{title:{required:!1,tsType:{name:"string"},description:"Block title",defaultValue:{value:'"Notifications"',computed:!1}},unreadCount:{required:!1,tsType:{name:"number"},description:"Unread notification count"},items:{required:!0,tsType:{name:"Array",elements:[{name:"NotificationItem"}],raw:"NotificationItem[]"},description:"Notification items"},className:{required:!1,tsType:{name:"string"},description:"Additional class names"}}};const k={title:"Blocks/Notifications",component:m,tags:["autodocs"]},i={render:()=>e.jsx("div",{className:"w-[460px] p-6",children:e.jsx(m,{unreadCount:7,items:[{id:"1",avatar:e.jsx(n,{type:"image",src:"https://i.pravatar.cc/150?img=11",size:"sm"}),text:e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"font-medium text-grey-700",children:"David"})," left a comment on"," ",e.jsx("span",{className:"font-medium text-primary-400",children:"Site redesign"})]}),date:"Thurs 21, 2023",time:"10 mins",unread:!0},{id:"2",avatar:e.jsx(n,{type:"image",src:"https://i.pravatar.cc/150?img=11",size:"sm"}),text:e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"font-medium text-grey-700",children:"David"})," left a comment on"," ",e.jsx("span",{className:"font-medium text-primary-400",children:"Site redesign"})]}),date:"Thurs 21, 2023",time:"10 mins",unread:!0,link:{label:"Marketing Design",href:"#"},content:{type:"file",title:"Meeting minute",size:"13MB",fileType:"PDF File",date:"11 Sept 23"}},{id:"3",avatar:e.jsx(n,{type:"image",src:"https://i.pravatar.cc/150?img=11",size:"sm"}),text:e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"font-medium text-grey-700",children:"David"})," left a comment on"," ",e.jsx("span",{className:"font-medium text-primary-400",children:"Site redesign"})]}),date:"Thurs 21, 2023",time:"10 mins",unread:!0,content:{type:"file",title:"Meeting minute",size:"13MB",fileType:"PDF File",date:"11 Sept 23"}},{id:"4",avatar:e.jsx(n,{type:"image",src:"https://i.pravatar.cc/150?img=11",size:"sm"}),text:e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"font-medium text-grey-700",children:"David"})," left a comment on"," ",e.jsx("span",{className:"font-medium text-primary-400",children:"Site redesign"})]}),date:"Thurs 21, 2023",time:"10 mins",link:{label:"Marketing Design",href:"#"},content:{type:"cta",primaryAction:{label:"Accept"},secondaryAction:{label:"Decline"}}},{id:"5",avatar:e.jsx(n,{type:"image",src:"https://i.pravatar.cc/150?img=11",size:"sm"}),text:e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"font-medium text-grey-700",children:"David"})," left a comment on"," ",e.jsx("span",{className:"font-medium text-primary-400",children:"Site redesign"})]}),date:"Thurs 21, 2023",time:"10 mins",link:{label:"Marketing Design",href:"#"},content:{type:"comment",avatar:e.jsx(n,{type:"image",src:"https://i.pravatar.cc/150?img=11",size:"xs"}),author:"David",timestamp:"2 hours ago",comment:"Kindly resolve the discrepancies, this is the blank empty state to start with nothing to share just you and the engineering team hating on the CPO",reactions:10,replies:12}}]})})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-[460px] p-6">
      <NotificationsBlock unreadCount={7} items={[{
      id: "1",
      avatar: <Avatar type="image" src="https://i.pravatar.cc/150?img=11" size="sm" />,
      text: <>
                <span className="font-medium text-grey-700">David</span> left a
                comment on{" "}
                <span className="font-medium text-primary-400">
                  Site redesign
                </span>
              </>,
      date: "Thurs 21, 2023",
      time: "10 mins",
      unread: true
    }, {
      id: "2",
      avatar: <Avatar type="image" src="https://i.pravatar.cc/150?img=11" size="sm" />,
      text: <>
                <span className="font-medium text-grey-700">David</span> left a
                comment on{" "}
                <span className="font-medium text-primary-400">
                  Site redesign
                </span>
              </>,
      date: "Thurs 21, 2023",
      time: "10 mins",
      unread: true,
      link: {
        label: "Marketing Design",
        href: "#"
      },
      content: {
        type: "file",
        title: "Meeting minute",
        size: "13MB",
        fileType: "PDF File",
        date: "11 Sept 23"
      }
    }, {
      id: "3",
      avatar: <Avatar type="image" src="https://i.pravatar.cc/150?img=11" size="sm" />,
      text: <>
                <span className="font-medium text-grey-700">David</span> left a
                comment on{" "}
                <span className="font-medium text-primary-400">
                  Site redesign
                </span>
              </>,
      date: "Thurs 21, 2023",
      time: "10 mins",
      unread: true,
      content: {
        type: "file",
        title: "Meeting minute",
        size: "13MB",
        fileType: "PDF File",
        date: "11 Sept 23"
      }
    }, {
      id: "4",
      avatar: <Avatar type="image" src="https://i.pravatar.cc/150?img=11" size="sm" />,
      text: <>
                <span className="font-medium text-grey-700">David</span> left a
                comment on{" "}
                <span className="font-medium text-primary-400">
                  Site redesign
                </span>
              </>,
      date: "Thurs 21, 2023",
      time: "10 mins",
      link: {
        label: "Marketing Design",
        href: "#"
      },
      content: {
        type: "cta",
        primaryAction: {
          label: "Accept"
        },
        secondaryAction: {
          label: "Decline"
        }
      }
    }, {
      id: "5",
      avatar: <Avatar type="image" src="https://i.pravatar.cc/150?img=11" size="sm" />,
      text: <>
                <span className="font-medium text-grey-700">David</span> left a
                comment on{" "}
                <span className="font-medium text-primary-400">
                  Site redesign
                </span>
              </>,
      date: "Thurs 21, 2023",
      time: "10 mins",
      link: {
        label: "Marketing Design",
        href: "#"
      },
      content: {
        type: "comment",
        avatar: <Avatar type="image" src="https://i.pravatar.cc/150?img=11" size="xs" />,
        author: "David",
        timestamp: "2 hours ago",
        comment: "Kindly resolve the discrepancies, this is the blank empty state to start with nothing to share just you and the engineering team hating on the CPO",
        reactions: 10,
        replies: 12
      }
    }]} />
    </div>
}`,...i.parameters?.docs?.source}}};const b=["Default"];export{i as Default,b as __namedExportsOrder,k as default};
