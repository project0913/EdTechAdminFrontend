
import { useState } from "react";
import styles from "./pagination.module.css";

export type Props = {
  pageSize:number;
  totalItems: number;
  onPageChange:(n:number)=>void;
  

};

export default function CustomPagination({
  pageSize,
  totalItems,
  onPageChange

  
  

}: Props) {
const pageNumbers= ()=>{
  let pages = [];
  for (let i = 1; i <= Math.ceil(totalItems/pageSize); i++) {
       pages.push(i)   
          
  }
  return pages;
}
const [activeNum,setActiveNum] = useState(1);



  return (
  
    <ul className={styles.pagination}>
        {
        
          pageNumbers().map((num)=><li key={num}
         
          onClick={()=>{
            onPageChange(num);
          }}><a  className={activeNum == num ? styles.activeLink : ''} onClick={()=>   setActiveNum(num)}>{num}</a></li>)
         }
       
       </ul>
  
  )}

   

    
     
  
