import{_ as b,h as v,j as m,a,b as c,d as e,t as r,F as i,e as n,p as h,k as f}from"./index.38d21509.js";const l=s=>(h("data-v-28c8a1b2"),s=s(),f(),s),g={class:"card"},B=l(()=>e("i",{class:"fa-regular fa-pen-to-square"},null,-1)),y=[B],I=l(()=>e("i",{class:"fa-regular fa-trash-can"},null,-1)),S=[I],x=["src"],j={class:"book-info"},q={class:"title"},C={class:"bookshelf"},E={props:{book:{type:Object,required:!0,default:()=>({authors:[],bookshelves:[],title:""})}},emits:{"remove-book":null},setup(s,{emit:_}){const o=s,d=v(),u=m(!1),p=()=>{_("remove-book",o.book),d.dispatch("removeBook",o.book)},k=()=>{u.value=!0};return(F,w)=>(a(),c("section",null,[e("div",g,[e("div",{class:"position-relative edit-bar"},[e("button",{class:"edit-btn",onClick:k},y),e("button",{class:"edit-btn",onClick:p},S)]),e("img",{class:"image cover",src:o.book.formats["image/jpeg"],alt:"Image"},null,8,x),e("div",j,[e("div",q,r(o.book.title),1),(a(!0),c(i,null,n(o.book.authors,t=>(a(),c("div",{class:"byline",key:t.name},r(t.name),1))),128)),e("div",C,[(a(!0),c(i,null,n(o.book.bookshelves,t=>(a(),c("div",{key:t}," #"+r(t),1))),128))])])])]))}};var L=b(E,[["__scopeId","data-v-28c8a1b2"]]);export{L as B};
