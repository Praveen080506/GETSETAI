import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion } from "motion/react";
import { EASE } from "@/lib/motion";
import { MagneticButton } from "@/components/site/Magnetic";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().trim().min(2, "Tell us your name").max(80, "Too long"),
  email: z.string().trim().email("Enter a valid email").max(160),
  budget: z.string().trim().max(40).optional(),
  message: z.string().trim().min(12, "A little more detail, please").max(1200, "Max 1200 chars"),
});

type FormValues = z.infer<typeof schema>;

const fields = [
  { name: "name", label: "Your name", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "budget", label: "Budget range (optional)", type: "text" },
] as const;

export function ContactForm() {
  const [sending, setSending] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), mode: "onBlur" });

  const onSubmit = async (values: FormValues) => {
    setSending(true);
    await new Promise((r) => setTimeout(r, 900));
    setSending(false);
    reset();
    toast.success("Message received", {
      description: `Thanks ${values.name.split(" ")[0]} — we reply within two working days.`,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10" noValidate>
      {fields.map((f, i) => (
        <motion.div
          key={f.name}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: i * 0.08, ease: EASE.cine }}
          className="group relative"
        >
          <input
            id={f.name}
            type={f.type}
            placeholder=" "
            aria-invalid={Boolean(errors[f.name])}
            {...register(f.name)}
            className="peer w-full border-b border-border bg-transparent pb-3 pt-6 text-lg text-foreground outline-none transition-colors duration-500 focus:border-foreground"
          />
          <label
            htmlFor={f.name}
            className="pointer-events-none absolute left-0 top-6 origin-left text-sm uppercase tracking-[0.2em] text-muted-foreground transition-all duration-500 peer-focus:-translate-y-6 peer-focus:scale-90 peer-focus:text-foreground peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-90"
          >
            {f.label}
          </label>
          {errors[f.name] && (
            <p role="alert" className="mt-2 text-xs text-destructive">
              {errors[f.name]?.message}
            </p>
          )}
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.24, ease: EASE.cine }}
        className="group relative"
      >
        <textarea
          id="message"
          rows={4}
          placeholder=" "
          aria-invalid={Boolean(errors.message)}
          {...register("message")}
          className="peer w-full resize-none border-b border-border bg-transparent pb-3 pt-6 text-lg text-foreground outline-none transition-colors duration-500 focus:border-foreground"
        />
        <label
          htmlFor="message"
          className="pointer-events-none absolute left-0 top-6 origin-left text-sm uppercase tracking-[0.2em] text-muted-foreground transition-all duration-500 peer-focus:-translate-y-6 peer-focus:scale-90 peer-focus:text-foreground peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-90"
        >
          The project
        </label>
        {errors.message && (
          <p role="alert" className="mt-2 text-xs text-destructive">
            {errors.message.message}
          </p>
        )}
      </motion.div>

      <div className={cn("pt-2", sending && "pointer-events-none")}>
        <MagneticButton type="submit" disabled={sending} cursorLabel="Send">
          {sending ? "Sending…" : "Send enquiry"}
        </MagneticButton>
      </div>
    </form>
  );
}
