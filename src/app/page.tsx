import { Calendar } from "@/components/ui/calendar";
import UserButton from "@/components/auth/UserButton";

function LandingPage() {
  return (
    <div className="flex flex-col justify-evenly items-center mx-auto h-[80vh]">
      <Calendar
        className="rounded-md border w-fit text-white mx-4 bg-zinc-700 h-fit"
        mode="single"
      />
      <UserButton />
    </div>
  );
}

export default LandingPage;
