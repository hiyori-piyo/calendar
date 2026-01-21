import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import './style.css'
import { useEffect, useState } from "react";
import jaLocale from "@fullcalendar/core/locales/ja";
import { ChangeEvent } from "./event";
import { Event } from "./event";
import { MileStones } from "./event";
import Model from "./Modal";
import SelectedDatePanel from "./SelectedDatePanel";



// カレンダー本体
const MyCalendar: React.FC = () => {
  const [addEvent, setAddEvent] = useState<Event>("hidden");
  const [changeEvent,setChangeevet]=useState<ChangeEvent[]>(()=>{

// ローカルストレージ
    const saved=localStorage.getItem("events");
    return saved ? JSON.parse(saved):[];
  })

//   クリックしたときの日付
  const [selectDate,setSelectdate]=useState("")
//   クリックしたときのイベント
  const [selectEvent,setSelectevent]=useState<ChangeEvent>({id:"",title:"",start:"",color:""})
  const [detailOpen,setDetailopen]=useState(false)

//   日付クリックしたらモーダル出して日付取得
  const handleClick = (info:any) => {
    setAddEvent("display");
    setSelectdate(info.dateStr)
  };
//   日付クリックしたら詳細ウィンドウ出す
  const handleEventClick=(info:any)=>{
    const eventData:ChangeEvent={
      id:info.event.id,
        title: info.event.title,
        start: info.event.startStr,
        color: info.event.backgroundColor || info.event.borderColor,
        extendedProps:{
        detail:info.event.extendedProps?.detail,
        milestones:info.event.extendedProps?.milestones,
        type:info.event.extendedProps.type,
        isComplete:info.event.extendedProps.isComplete
        }
    }
    setSelectevent(eventData)
    setDetailopen(true)
  }

  const onclose=()=>{
    setDetailopen(false)
  }

//   モーダルからの受取
  const receive=(taskTitle:string,taskTime:string,milestone:MileStones[],taskColor:string,taskDetail:string)=>{

    const mainID=crypto.randomUUID()

// メインのタスク
    let deadline:string
    if (taskTime) {
        deadline=`${selectDate}T${taskTime}:00`;
    } else {
        deadline=selectDate
    }

// 中間目標のタスク
    const mileTask:ChangeEvent[]=milestone.map((m)=>{
        return{
        id:crypto.randomUUID(),
        title:m.text,
        start:m.date,
        textColor: "#006064",
        backgroundColor:`${taskColor}33`,
        extendedProps:{
            type:"mile",
            isComplete:false,
            parentID:mainID
        }
        
        

        }
    })

// 色の受取



    
    setChangeevet([...changeEvent,{
        id:mainID,
        title:taskTitle,
        start:deadline,
        display: 'list-item',
        color:taskColor,
        extendedProps:{
            detail:taskDetail,
            milestones:milestone,
            type:"main",
            isComplete:false
        }
    },...mileTask])
    setAddEvent("hidden");
   
  }

//   モーダル閉めるときの処理
  const close=()=>{

    setAddEvent("hidden")
  }

//   モーダルで追加した情報の中身変わると再描画
  useEffect(()=>{

    localStorage.setItem("events",JSON.stringify(changeEvent))
  },[changeEvent])


  const onToggleComplete=(id:string)=>{


    const updateEvent=changeEvent.map((m)=>{

    if (id !== m.id || !m.extendedProps) return m

      if (id===m.id) {
        const isNewComplete=!m.extendedProps?.isComplete
        return{...m,backgroundColor: isNewComplete ? "#d1d1d1" : m.color,extendedProps:{...m.extendedProps,isComplete:isNewComplete}}
      } else{
        return m
      }
    })
    setChangeevet(updateEvent)
  }

  return (
    <div className="calendar-container">
   
      <FullCalendar
      locale={jaLocale} // 言語を日本語に設定
        allDayText="終日" // 「終日」の表示用テキスト
        height={700} // ヘッダーとフッターを含むカレンダー全体の高さを設定する
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]} // プラグインを読み込む
        initialView="dayGridMonth" // カレンダーが読み込まれたときの初期ビュー
        slotDuration="00:30:00" // タイムスロットを表示する頻度。
        //ユーザーはクリックしてドラッグすることで、複数の日付または時間帯を強調表示できます。
        //ユーザーがクリックやドラッグで選択できるようにするには、インタラクション・プラグインをロードし、このオプションをtrueに設定する必要があります。
        selectable={true}
        businessHours={{
          daysOfWeek: [1, 2, 3, 4, 5],
          startTime: "00:00",
          endTime: "24:00",
        }} // カレンダーの特定の時間帯を強調します。 デフォルトでは、月曜日から金曜日の午前9時から午後5時までです。
        weekends={true} // カレンダービューに土曜日/日曜日の列を含めるかどうか。
        headerToolbar={{
          start: "title",
          center: "prev,next,today",
          end: "dayGridMonth,timeGridWeek",
        }} // headerToolbarのタイトルに表示されるテキストを決定します。
        // ref={ref}
        events={changeEvent}
        dateClick={handleClick} //ユーザーがイベントをクリックしたときにトリガーされます。
        eventClick={handleEventClick}

        // select={handleSelect}//日時が選択されるとトリガーされる
      />
      <Model modelstate={addEvent} onSave={receive}  onClose={close}/>
      <SelectedDatePanel event={selectEvent} allEvent={changeEvent} open={detailOpen} onButton={onToggleComplete} onClose={onclose}/>
    
    </div>
  );
};








export default MyCalendar




