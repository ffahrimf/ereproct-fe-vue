import { reactive, ref } from "vue";
import { useResetErr } from "../../../composables/use-helper";
import { ReportIF } from "../report.interface";

export interface SetupReport {
  id: number | null;
  event_id: number | null;
  proctor_id: number | null;
  number_of_participants: number;
  number_of_participants_logged_in: number;
  number_of_participants_only_logged_in: number;
  // number_of_participants_not_logged_in: number;
  number_of_participants_completed: number;
  number_of_participants_not_completed: number;
  status: string | null;
  note: string | null;
}

export const errs: { [key: string]: string } = reactive({});
export const report = ref<ReportIF[] | []>([]);

export const form = reactive<Partial<SetupReport>>({
  id: null,
  event_id: null,
  proctor_id: null,
  number_of_participants: 0,
  number_of_participants_logged_in: 0,
  number_of_participants_only_logged_in: 0,
  // number_of_participants_not_logged_in: 0,
  number_of_participants_completed: 0,
  number_of_participants_not_completed: 0,
  status: null,
  note: null
});

export const resetForm = () => {
  form.id = null;
  form.event_id = null;
  form.proctor_id = null;
  form.number_of_participants = 0;
  form.number_of_participants_logged_in = 0;
  form.number_of_participants_only_logged_in = 0;
  // form.number_of_participants_not_logged_in = 0;
  form.number_of_participants_completed = 0;
  form.number_of_participants_not_completed = 0;
  form.status = null;
  form.note = null;
  useResetErr(errs);
};
