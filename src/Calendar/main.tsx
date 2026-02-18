import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./style.css";
import { useEffect, useState } from "react";
import jaLocale from "@fullcalendar/core/locales/ja";
import { ChangeEvent } from "./event";
import { Event } from "./event";
import Modal from "./Modal";
import SelectedDatePanel from "./SelectedDatePanel";
import { allEvents } from "./calendarSQL";

// カレンダー本体
const MyCalendar: React.FC = () => {
  const [addEvent, setAddEvent] = useState<Event>("hidden");
  const [changeEvent, setChangeEvent] = useState<ChangeEvent[]>([]);

  // useStateは非同期処理使えないのでuseEffectで代用
  const fetchEvents = async () => {
    try {
      const data = await allEvents();
      setChangeEvent(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  //   空イベントをクリックしたときの日付
  const [selectDate, setSelectdate] = useState("");
  //   既存イベントをクリックしたときのイベント
  const [selectEvent, setSelectevent] = useState<string>("");
  const [detailOpen, setDetailopen] = useState(false);

  //   日付クリックしたら日付取得してモーダル出す
  const handleClick = (info: any) => {
    setAddEvent("display");
    setSelectdate(info.dateStr);
  };
  //   イベントクリックしたら詳細ウィンドウ出す
  const handleEventClick = (info: any) => {
    console.log("クリックされたID:", info.event.id);
    setSelectevent(info.event.id);
    setDetailopen(true);
  };

  const [editMainData, setEditMainData] = useState<any>(null);
  const [editChildData, setEditChildData] = useState<any[]>([]);
  const [editModal, setEditModal] = useState("hidden");

  const onedit = (mainData: any, childData: any[]) => {
    setEditMainData(mainData);
    setEditChildData(childData);
    setEditModal("display");
  };

  // 詳細ウィンドウ閉じる処理
  const onclose = () => {
    setDetailopen(false);
  };

  // イベント削除処理
  const ondelete = (id: string) => {
    setChangeEvent(changeEvent.filter((e) => e.id !== id && e.extendedProps?.parentID !== id));
    setDetailopen(false);
  };

  //   モーダルからの受取
  const receive = (newEvent: ChangeEvent[]) => {
    // 入力されたイベントを追加
    setChangeEvent([...changeEvent, ...newEvent]);
    setAddEvent("hidden");
  };

  //   モーダルでキャンセル押されたときの処理
  const close = () => {
    setAddEvent("hidden");
  };

  //   新しいイベントが来るとローカルストレージを最新の状態に同期
  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(changeEvent));
  }, [changeEvent]);

  // 達成済みボタンを押したときの処理
  const onToggleComplete = (id: string) => {
    const updateEvent = changeEvent.map((m) => {
      if (id !== m.id || !m.extendedProps) return m;

      if (id === m.id) {
        const isNewComplete = !m.extendedProps?.isComplete;
        return {
          ...m,
          backgroundColor: isNewComplete ? "#d1d1d1" : m.color,
          extendedProps: { ...m.extendedProps, isComplete: isNewComplete },
        };
      } else {
        return m;
      }
    });
    setChangeEvent(updateEvent);
  };

  return (
    <div className="calendar-container">
      <FullCalendar
        locale={jaLocale} // 言語を日本語に設定
        allDayText="終日" // 「終日」の表示用テキスト
        height={700} // ヘッダーとフッターを含むカレンダー全体の高さを設定する
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]} // プラグインを読み込む
        initialView="dayGridMonth" // カレンダーが読み込まれたときの初期ビュー
        slotDuration="00:30:00" // タイムスロットを表示する頻度。
        businessHours={{
          daysOfWeek: [1, 2, 3, 4, 5],
          startTime: "00:00",
          endTime: "24:00",
        }} // カレンダーの特定の時間帯を強調。 デフォルトでは、月曜日から金曜日の午前9時から午後5時まで
        weekends={true} // カレンダービューに土曜日/日曜日の列を含めるかどうか。
        headerToolbar={{
          start: "title",
          center: "prev,next,today",
          end: "dayGridMonth,timeGridWeek",
        }} // headerToolbarのタイトルに表示されるテキストを決定します。
        events={changeEvent}
        dateClick={handleClick} //ユーザーがイベントをクリックしたときにトリガーされる。
        eventClick={handleEventClick}
      />
      <Modal
        modalstate={addEvent}
        onSave={receive}
        onClose={close}
        selectDate={selectDate}
      />
      <Modal
        modalstate={editModal}
        onClose={() => setEditModal("hidden")}
        onSave={(_: ChangeEvent[]) => { fetchEvents(); setEditModal("hidden"); }}
        mainData={editMainData}
        childData={editChildData}
      />
      <SelectedDatePanel
        ID={selectEvent}
        allEvent={changeEvent}
        open={detailOpen}
        onEdit={onedit}
        onButton={onToggleComplete}
        onDelete={ondelete}
        onClose={onclose}
      />
    </div>
  );
};

export default MyCalendar;
