import{_ as f,o as e,c as s,a as t,t as _,F as d,r as p,b as C,d as q,e as c,w as N,u,n as x,f as R,g as V,h as j,i as F}from"./index.aa781b19.js";const H={class:"card"},L=["src"],M={class:"book-info"},S={class:"title"},z={class:"bookshelf"},D={props:{book:{type:Object,required:!0,default:()=>({authors:[],bookshelves:[],title:""})}},setup(v){const r=v;return(m,i)=>(e(),s("section",null,[t("div",H,[t("img",{class:"image cover",src:r.book.formats["image/jpeg"],alt:"Image"},null,8,L),t("div",M,[t("div",S,_(r.book.title),1),(e(!0),s(d,null,p(r.book.authors,a=>(e(),s("div",{class:"byline",key:a.name},_(a.name),1))),128)),t("div",z,[(e(!0),s(d,null,p(r.book.bookshelves,a=>(e(),s("div",{key:a}," #"+_(a),1))),128))])])])]))}};var E=f(D,[["__scopeId","data-v-5d2ab5a2"]]);const O={key:0},A={class:"position-fixed row tm-row page-nav"},G={class:"tm-prev-next-wrapper"},J={class:"row tm-row book-list"},K={key:1},Q={setup(v){const m=R(),i=V(),a=j(),o=C({currentPage:0}),g=()=>{var n;o.currentPage=parseInt((n=i.query.page)!=null?n:1)};q(g);const l=c(()=>a.state.books);N(()=>i.query.page,g);const w=c(()=>Math.ceil(l.value.length/6)),B=c(()=>{const n=(o.currentPage-1)*6,P=o.currentPage*6;return[...l.value].slice(n,P)}),b=()=>{m.push({name:"home",query:{page:o.currentPage}})},I=()=>{k.value&&(o.currentPage+=1),b()},$=()=>{h.value&&(o.currentPage-=1),b()},k=c(()=>o.currentPage<w.value),h=c(()=>o.currentPage>1);return(n,P)=>(e(),s("div",null,[u(l).length?(e(),s("div",O,[t("div",A,[t("div",G,[t("button",{onClick:$,class:x([{disabled:!u(h)},"mb-2 tm-btn tm-btn-primary tm-prev-next tm-mr-20"])}," prev ",2),t("button",{onClick:I,class:x([{disabled:!u(k)},"mb-2 tm-btn tm-btn-primary tm-prev-next"])}," next ",2)])]),t("div",J,[(e(!0),s(d,null,p(u(B),y=>(e(),F(E,{key:y.id,book:y},null,8,["book"]))),128))])])):(e(),s("div",K,"Loading..."))]))}};var U=f(Q,[["__scopeId","data-v-a56c3e80"]]);export{U as default};
