import { supabase } from "./lib/supabase";

export async function test() {
  const { data, error } = await supabase
    .from("streams")
    .select("*");

  console.log(data, error);
}
