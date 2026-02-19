import { ChangeEvent } from "./event";
import { searchMainEvent } from "./calendarSQL";
import { searchChildEvent } from "./calendarSQL";
import { onToggleComplete, deleteEvent } from "./calendarSQL";
import { useEffect, useState } from "react";

const SelectedDatePanel = (props: {
  ID: string;
  allEvent: ChangeEvent[];
  open: boolean;
  onEdit: (mainData: ChangeEvent, childData: ChangeEvent[]) => void;
  onButton: (id: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) => {
  const ID = props.ID;
  const [mainData, setData] = useState<any>();
  const [childData, setChildData] = useState<any>();
  // 詳細ウィンドウの状態がfalseのとき、もしくは受け取るデータが空っぽならそのまま閉じる

  // 親（メインタスク）のIDと一致するIDを中間目標の配列の中から探し、定数に入れる

  const list = async () => {
    if (!ID) return;
    try {
      const mainData = await searchMainEvent(ID);
      const childData = await searchChildEvent(ID);
      setData(mainData);
      setChildData(childData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!props.open || !ID) {

      return setData("");
    }

    list();
  }, [props.open, ID]);

  if (!props.open || !ID || !mainData) {
    return null; // データが届くか、パネルが開くまではここで止める
  }

  const onToggleCompleted = async (id: string) => {
    const Complete = await onToggleComplete(id, mainData.isComplete);
    setData(Complete);
  };

  const onEdit = (mainData: ChangeEvent, childData: ChangeEvent[]) => {
    props.onEdit(mainData, childData);
  };

  console.log("完了状況:" + mainData.isComplete);

  return (
    <div className={`detail-panel ${props.open ? "open" : ""}`}>
      <div>
        <span>タスク：{mainData.title}</span> <br />
        {mainData.detail && (
          <>
            <span>詳細：{mainData.detail}</span> <br />
          </>
        )}
        {/* ここでクリックすると完了済になった中間目標のIDが親へと渡される */}
        <span>
          達成した
          <input
            type="checkbox"
            key={`check-${mainData.id}`}
            onChange={() => onToggleCompleted(mainData.id)}
            defaultChecked={mainData.isComplete}
          />
        </span>
        <span>
          <input
            type="button"
            value="編集"
            className="btn-close"
            onClick={() => onEdit(mainData, childData)}
          />

          <input
            type="button"
            value="削除"
            className="btn-close"
            onClick={async () => {
              if (!window.confirm(`「${mainData.title}」を削除しますか？`))
                return;
              try {
                await deleteEvent(mainData.id);
                props.onDelete(mainData.id);
              } catch (error) {
                console.error("削除失敗:", error);
                alert("削除に失敗しました。");
              }
            }}
          />
        </span>
        <div>
          {childData.length > 0 ? (
            childData.map((m: any) => {
              // 日付をyyyy-mm-ddにする
              const dateString = m.start
                ? new Date(m.start).toLocaleDateString("ja-JP")
                : "";

              return (
                <div
                  key={m.id}
                  style={{
                    // 完了済になった中間タスクに横線を引く
                    textDecoration: m.isComplete ? "line-through" : "none",
                    color: m.isComplete ? "#888" : "inherit",
                    marginBottom: "5px",
                  }}
                >
                  <span>
                    {m.title}：{dateString.toString()}まで　
                  </span>
                  {/* 完了済みになってたら完了しましたと出す */}
                  <span>
                    {m.extendedProps?.isComplete ? "完了しました" : ""}
                  </span>{" "}
                  <br />
                </div>
              );
            })
          ) : (
            <span></span>
          )}

          <input
            type="button"
            value="閉じる"
            className="btn-close"
            onClick={() => props.onClose()}
          />
        </div>
      </div>
    </div>
  );
};

export default SelectedDatePanel;
