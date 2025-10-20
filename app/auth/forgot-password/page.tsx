"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";
import { Loader2, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Formato de e-mail inválido")
    .required("O e-mail é obrigatório"),
});

export default function ForgotPasswordPage() {
  const { sendPasswordResetOtp, verifyOtp } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<"enter-email" | "enter-otp">("enter-email");
  const [userEmail, setUserEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSendOtp = async (
    values: { email: string },
    helpers: FormikHelpers<{ email: string }>
  ) => {
    const { error } = await sendPasswordResetOtp(values.email);

    if (error) {
      toast.error("Erro", {
        description:
          "Não foi possível enviar o e-mail. Verifique se o e-mail está correto e tente novamente.",
      });
    } else {
      toast.info("E-mail enviado!", {
        description: `Enviamos um código de recuperação para ${values.email}.`,
      });
      setUserEmail(values.email);
      setStep("enter-otp");
    }
    helpers.setSubmitting(false);
  };
  
  const handleVerifyOtp = async () => {
    if (otp.length !== 6 || !userEmail) return;

    setIsVerifying(true);
    const { error } = await verifyOtp({
      email: userEmail,
      token: otp,
      type: "recovery",
    });

    if (error) {
      toast.error("Erro na verificação", { description: "O código está incorreto ou expirou." });
    } else {
      toast.success("Código verificado!", { description: "Agora você pode criar uma nova senha." });
      router.push("/auth/update-password");
    }
    setIsVerifying(false);
  };


  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        {step === "enter-email" ? (
          <>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Recuperar Senha</CardTitle>
              <CardDescription>
                Insira seu e-mail para receber um código de verificação.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Formik
                initialValues={{ email: "" }}
                validationSchema={ForgotPasswordSchema}
                onSubmit={handleSendOtp}
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Field
                          as={Input}
                          id="email" name="email" type="email"
                          placeholder="seu@email.com"
                          className={`pl-10 ${touched.email && errors.email ? "border-destructive" : ""}`}
                          disabled={isSubmitting}
                        />
                      </div>
                      {touched.email && errors.email && (
                        <p className="text-sm text-destructive">{errors.email}</p>
                      )}
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Enviar Código
                    </Button>
                  </Form>
                )}
              </Formik>
              <div className="mt-4 text-center text-sm">
                <Link href="/auth" className="underline">Voltar para o login</Link>
              </div>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Código de Recuperação</CardTitle>
              <CardDescription>
                Enviamos um código de 6 dígitos para <strong>{userEmail}</strong>.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    {[...Array(6)].map((_, i) => <InputOTPSlot key={i} index={i} />)}
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button onClick={handleVerifyOtp} disabled={isVerifying || otp.length < 6} className="w-full">
                {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verificar Código
              </Button>
               <div className="mt-4 text-center text-sm">
                <Button variant="link" onClick={() => setStep('enter-email')}>
                  Não recebeu? Tente enviar novamente.
                </Button>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}