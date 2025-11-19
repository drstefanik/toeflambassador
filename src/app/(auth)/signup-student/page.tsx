import { SignupStudentForm } from "./signup-form";
import { getActiveCenters } from "@/lib/repositories/centers";

export default async function SignupStudentPage() {
  let centers = [] as Awaited<ReturnType<typeof getActiveCenters>>;
  try {
    centers = await getActiveCenters();
  } catch (error) {
    console.warn("Impossibile caricare i centri attivi", error);
  }
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold text-slate-900">Registrazione Studente</h1>
      <p className="mt-2 text-slate-600">
        Crea il tuo account per accedere alla dashboard e acquistare il voucher TOEFL iBT®.
      </p>
      <div className="mt-8 rounded-3xl bg-white p-8 shadow">
        <SignupStudentForm
          centers={centers.map((center) => ({
            id: center.id,
            name: center.name,
            slug: center.slug,
          }))}
        />
      </div>
    </div>
  );
}
