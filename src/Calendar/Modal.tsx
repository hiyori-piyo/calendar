import { MileStones } from "./event";
import { useState } from "react";
import { Event } from "./event";
import { useEffect } from "react";
import { ChangeEvent } from "./event";
import { supabase } from "./supabaseClient";
import "./style.css";

const Modal = (props: {
  modalstate: string;
  onSave?: (newEvent: ChangeEvent[]) => void;
  onClose: () => void;
  selectDate?: string;
  mainData?: any;
  childData?: any;
}) => {
  //   表示中か非表示中か
  const state = props.modalstate;
  const selectDate = props.selectDate ?? "";

  //   モーダルで中間目標追加した情報格納する配列
  const [milestones, setMilestones] = useState<MileStones[]>([
    { text: "", date: "" },
  ]);

  //   モーダル閉じたら概要やタスク名も空白に戻す
  useEffect(() => {
    if (state === "display") {
      if (props.mainData) {
        setTaskTitle(props.mainData.title);
        // ISO 8601形式 (2026-02-18T10:00:00) から HH:mm を抽出
        const time = props.mainData.start?.includes("T")
          ? props.mainData.start.split("T")[1].slice(0, 5)
          : "";
        setTaskTime(time);
        setTaskDetail(props.mainData.detail || ""); // SQLのカラム名に合わせて調整
        setTaskColor(props.mainData.color || "#3788d8");

        // 中間目標（配列）をセット
        if (props.childData && props.childData.length > 0) {
          setMilestones(
            props.childData.map((c: any) => ({
              text: c.title,
              date: c.start ? c.start.split("T")[0] : "", // yyyy-mm-dd 形式にする
            }))
          );
        }
      } else {
        setTaskTitle("");
        setTaskTime("");
        setMilestones([{ text: "", date: "" }]);
        setTaskDetail("");
      }
    }
  }, [state]);

  // 　中間目標の欄を追加する
  const addMilestones = () => {
    setMilestones([...milestones, { text: "", date: "" }]);
  };

  // 　中間目標の欄を削除する
  const miledelete = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  //   保存ボタンが押されたときの処理
  const insert = async (
    taskTitle: string,
    taskTime: string,
    milestone: MileStones[],
    taskColor: string,
    taskDetail: string
  ) => {
    const mainID = crypto.randomUUID();

    // メインのタスク
    let deadline: string;
    if (taskTime) {
      deadline = `${selectDate}T${taskTime}:00`;
    } else {
      deadline = selectDate;
    }

    const mainTask: ChangeEvent = {
      id: mainID,
      title: taskTitle,
      start: deadline,
      display: "list-item",
      color: taskColor,
      extendedProps: {
        detail: taskDetail,
        milestones: milestone,
        type: "main",
        isComplete: false,
      },
    };

    // 中間目標のタスク
    const mileTask: ChangeEvent[] = milestone.map((m) => {
      return {
        id: crypto.randomUUID(),
        title: m.text,
        start: m.date,
        textColor: "#006064",
        backgroundColor: `${taskColor}33`,
        extendedProps: {
          type: "mile",
          isComplete: false,
          parentID: mainID,
        },
      };
    });

    const allEvent = [mainTask, ...mileTask];

    try {
      const { error } = await supabase
        .from("events") // 作成したテーブル名
        .insert(
          allEvent.map((e) => ({
            id: e.id,
            title: e.title,
            start: e.start,

            display: e.display,
            color: e.color,

            text_color: e.textColor,
            background_color: e.backgroundColor,

            type: e.extendedProps?.type,
            is_complete: e.extendedProps?.isComplete,
            detail: e.extendedProps?.detail,

            parent_id: e.extendedProps?.parentID,
          }))
        );

      if (error) throw error;

      // 入力されたイベントを追加
      if (props.onSave) {
        props.onSave(allEvent); // props.onSave がオプショナルな場合は、存在確認をしてから呼ぶ
      }
    } catch (error) {
      console.error("保存失敗:", error);
      alert("データベースへの保存に失敗しました。");
    }
  };

  const [taskTitle, setTaskTitle] = useState("");
  const [taskTime, setTaskTime] = useState("");
  const [taskColor, setTaskColor] = useState("#3788d8");
  const [taskDetail, setTaskDetail] = useState("");

  const isEditMode = !!props.mainData;

  //   既存タスクの更新
  const update = async (
    taskTitle: string,
    taskTime: string,
    milestone: MileStones[],
    taskColor: string,
    taskDetail: string
  ) => {
    const datepart = props.mainData.start?.split("T")[0] || "";
    let deadline: string;
    if (taskTime) {
      deadline = `${datepart}T${taskTime}:00`;
    } else {
      deadline = datepart;
    }

    try {
      // メインタスクを更新
      const { error: mainError } = await supabase
        .from("events")
        .update({
          title: taskTitle,
          start: deadline,
          color: taskColor,
          detail: taskDetail,
        })
        .eq("id", props.mainData.id);

      if (mainError) throw mainError;

      // 既存の中間目標を削除
      const { error: deleteError } = await supabase
        .from("events")
        .delete()
        .eq("parent_id", props.mainData.id);

      if (deleteError) throw deleteError;

      // 新しい中間目標を挿入
      const mileTask = milestone
        .filter((m) => m.text.trim())
        .map((m) => ({
          id: crypto.randomUUID(),
          title: m.text,
          start: m.date,
          text_color: "#006064",
          background_color: `${taskColor}33`,
          type: "mile",
          is_complete: false,
          parent_id: props.mainData.id,
        }));

      if (mileTask.length > 0) {
        const { error: mileError } = await supabase
          .from("events")
          .insert(mileTask);

        if (mileError) throw mileError;
      }

      if (props.onSave) {
        props.onSave([]);
      } else {
        props.onClose();
      }
    } catch (error) {
      console.error("更新失敗:", error);
      alert("データベースへの更新に失敗しました。");
    }
  };

  if (state === "display") {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2 className="modal-title">
            {isEditMode ? "イベント編集" : "イベント追加"}
          </h2>
          <div className="input-row">
            {/* メインタスク */}
            <div className="input-group text-long">
              <label className="input-label">タスク</label>
              <input
                type="text"
                placeholder="例：Reactの勉強"
                className="input-field"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
              />
            </div>

            {/* 締め切り時間 */}
            <div className="input-group">
              <label className="input-label">締切時間</label>
              <input
                type="time"
                name=""
                id=""
                className="input-field"
                value={taskTime}
                onChange={(e) => setTaskTime(e.target.value)}
              />
            </div>
          </div>

          {/* 色の指定 */}
          <div className="input-group">
            <input
              type="color"
              name=""
              id=""
              value={taskColor}
              style={{ cursor: "pointer" }}
              onChange={(e) => {
                setTaskColor(e.target.value);
              }}
            />
          </div>

          {/* 詳細 */}
          <div className="input-group text-long">
            <label className="input-label">詳細</label>
            <input
              type="text"
              placeholder=""
              className="input-field"
              value={taskDetail}
              onChange={(e) => setTaskDetail(e.target.value)}
            />
          </div>

          {/* 中間目標 */}
          <div
            style={{
              marginTop: "20px",
              borderTop: "1px solid #eee",
              paddingTop: "10px",
            }}
          >
            <div className="flex-between">
              <span>目標</span>
              <input
                type="button"
                value="＋目標を追加"
                onClick={addMilestones}
              />
            </div>

            {/* 中間目標増やす */}
            <div className="milestone-list">
              {milestones.map((miletone, index) => {
                return (
                  <div className="input-row">
                    <div className="input-group text-long-l">
                      <input
                        type="text"
                        value={miletone.text}
                        className="input-field"
                        style={{ flex: 2 }}
                        onChange={(e) => {
                          const newmile = [...milestones];
                          newmile[index] = {
                            ...newmile[index],
                            text: e.target.value,
                          };
                          setMilestones(newmile);
                        }}
                      />
                    </div>
                    <div className="input-group date-short">
                      <input
                        type="date"
                        name=""
                        id=""
                        value={miletone.date}
                        className="input-field"
                        style={{ flex: 1.5 }}
                        onChange={(e) => {
                          const newmile = [...milestones];
                          newmile[index] = {
                            ...newmile[index],
                            date: e.target.value,
                          };
                          setMilestones(newmile);
                        }}
                      />
                    </div>
                    <input
                      type="button"
                      value="削除"
                      className="btn-delete"
                      onClick={() => miledelete(index)}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* イベント追加/保存ボタン */}
          <button
            className="btn btn-primary"
            onClick={() =>
              isEditMode
                ? update(taskTitle, taskTime, milestones, taskColor, taskDetail)
                : insert(taskTitle, taskTime, milestones, taskColor, taskDetail)
            }
            disabled={!taskTitle.trim()}
          >
            {isEditMode ? "保存" : "イベントを追加"}
          </button>

          {/* キャンセルボタン */}
          <button onClick={() => props.onClose()} className="btn btn-secondary">
            キャンセル
          </button>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default Modal;
