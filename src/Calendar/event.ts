export type Event = "display" | "hidden";
export type MileStones = { text: string; date: string };
export type ChangeEvent={
                id:string
                title:string,
                start?:string,
                textColor?: string,
                backgroundColor?: string,
                display?: string,
                color?:string,
                extendedProps?: {
                    type :"main"|"mile"
                    isComplete:boolean
                    detail?: string
                    milestones?:MileStones[]
                    parentID?:string
                }
               }