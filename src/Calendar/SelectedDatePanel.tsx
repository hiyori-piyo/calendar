
import { ChangeEvent } from "./event"
import { searchMainEvent } from "./calendarSQL"
import { searchChildEvent } from "./calendarSQL"
import { useEffect, useState } from "react"
import { br } from "@fullcalendar/core/internal-common"


const SelectedDatePanel=(props:{ ID:string,allEvent:ChangeEvent[],open:boolean,onButton:(id:string)=>void,onClose:()=>void})=>{


    const ID=props.ID
    const [mainData,setData]=useState<any>()
    const [childData,setChildData]=useState<any>()

    // 詳細ウィンドウの状態がfalseのとき、もしくは受け取るデータが空っぽならそのまま閉じる

  
  
  // 親（メインタスク）のIDと一致するIDを中間目標の配列の中から探し、定数に入れる

  useEffect(()=>{

    
    if (!props.open || !ID) {
      
      console.log(ID)
      
      return setData("")
      
    }
    
    
    const list= async ()=>{
      try {
        const mainData=await searchMainEvent(ID)
        const childData=await searchChildEvent(ID)
        setData(mainData)
        setChildData(childData)
        
      } catch (error) {
        console.error(error)
      }
      
      
    }
    
    list()
    
    
  } ,[props.open,ID])
  
  
  if (!props.open || !ID || !mainData) {
    
    return null; // データが届くか、パネルが開くまではここで止める
  }
  console.log("中間タスクの時")



    return(
        <div className={`detail-panel ${props.open ? "open" : ""}`}>

            <div>
                <span>タスク：{mainData.title}</span> <br />

                {/* ここでクリックすると完了済になった中間目標のIDが親へと渡される */}
                <span>達成した<input type="radio" name="" id="" onClick={()=>props.onButton(mainData.id)}/></span> 
                
                <span>中間目標</span>
                <div>
                    
                    
                    {childData.length > 0 ? (
                        childData.map((m:any)=> {
                          
                          // 日付をyyyy-mm-ddにする
                          const dateString = m.start ? new Date(m.start).toLocaleDateString("ja-JP") : "";
                          
                          return (

                          
                          
                          <div key={m.id}
                              style={{ 
                              // 完了済になった中間タスクに横線を引く
                              textDecoration: m.isComplete ? "line-through" : "none",
                              color: m.isComplete ? "#888" : "inherit",
                              marginBottom: "5px"
                            }}>
                          
                            <span>{m.title}：{dateString.toString()}まで　</span>

                            {/* 完了済みになってたら完了しましたと出す */}
                            <span>{m.extendedProps?.isComplete ? "完了しました":""}</span> <br />
                          </div>
                          
                        )})
                      ) : (<span>なし</span>
                      )}
                
                <input type="button" value="閉じる" className="btn-close" onClick={()=>props.onClose()}/>

            </div>

        </div>
        </div>
        
)



}

export default SelectedDatePanel