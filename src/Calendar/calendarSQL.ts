import { supabase } from "./supabaseClient";
import { ChangeEvent } from "./event";

// export const EventSQL ={

export const allEvents = async () => {
  const { data, error } = await supabase.from("events").select("*");
  if (error) throw error;

  return data.map((e) => ({
    id: e.id,
    title: e.title,
    start: e.start,

    display: e.display,
    color: e.color,

    textColor: e.text_color,
    backgroundColor: e.background_color,

    extendedProps: {
      type: e.type,
      isComplete: e.is_complete,
      detail: e.detail,
      parentID: e.parent_id,
    },
  }));
};

export const searchMainEvent = async (id: string) => {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return {
    id: data.id,
    title: data.title,
    start: data.start,

    display: data.display,
    color: data.color,

    textColor: data.text_color,
    backgroundColor: data.background_color,

    type: data.type,
    isComplete: data.is_complete,
    detail: data.detail,

    parent_id: data.parent_id,
  };
};

export const searchChildEvent = async (id: string) => {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("parent_id", id);
  if (error) throw error;

  return data.map((e) => ({
    id: e.id,
    title: e.title,
    start: e.start,

    display: e.display,
    color: e.color,

    textColor: e.text_color,
    backgroundColor: e.background_color,

    type: e.type,
    isComplete: e.is_complete,
    detail: e.detail,

    parent_id: e.parent_id,
  }));
};

export const deleteEvent = async (id: string) => {
  const { error: childError } = await supabase
    .from("events")
    .delete()
    .eq("parent_id", id);
  if (childError) throw childError;

  const { error: mainError } = await supabase
    .from("events")
    .delete()
    .eq("id", id);
  if (mainError) throw mainError;
};

export const onToggleComplete = async (id: string, currentState: boolean) => {
  const { data, error } = await supabase
    .from("events")
    .update({ is_complete: !currentState })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    title: data.title,
    start: data.start,

    display: data.display,
    color: data.color,

    textColor: data.text_color,
    backgroundColor: data.background_color,

    type: data.type,
    isComplete: data.is_complete,
    detail: data.detail,

    parent_id: data.parent_id,
  };
};
