import { supabase } from "./supabaseClient";
import { ChangeEvent } from "./event";


// export const EventSQL ={

    export const allEvents=async ()=>{


    const {data,error}=await supabase .from('events') .select("*");
    if(error)throw error;

    return data.map(e =>({

            id:e.id,
            title:e.title,
            start:e.start,

            display:e.display,
            color:e.color,

            text_color:e.textColor,
            background_color:e.backgroundColor,

            type:e.extendedProps?.type,
            is_complete:e.extendedProps?.isComplete,
            detail:e.extendedProps?.detail,

            parent_id:e.extendedProps?.parentID,

    }))
}

    export const searchMainEvent=async (id:string)=>{

    
        const {data,error}=await supabase .from('events') .select("*") .eq("id" ,id).single()

        if (error) throw error

        return {

            id:data.id,
            title:data.title,
            start:data.start,

            display:data.display,
            color:data.color,

            text_color:data.textColor,
            background_color:data.backgroundColor,

            type:data.extendedProps?.type,
            is_complete:data.extendedProps?.isComplete,
            detail:data.extendedProps?.detail,

            parent_id:data.extendedProps?.parentID,

    }
    }

    export const searchChildEvent=async(id:string)=>{

        const {data,error}=await supabase .from('events') .select("*") .eq("parent_id",id)
        if (error) throw error

        return data.map(e =>({

            id:e.id,
            title:e.title,
            start:e.start,

            display:e.display,
            color:e.color,

            text_color:e.textColor,
            background_color:e.backgroundColor,

            type:e.extendedProps?.type,
            is_complete:e.extendedProps?.isComplete,
            detail:e.extendedProps?.detail,

            parent_id:e.extendedProps?.parentID,

    }))
    }




