import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PolicyPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Termos e Política de Privacidade</CardTitle>
        <CardDescription>
          Informações sobre o uso e os dados do Fynli.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 prose dark:prose-invert">
        <section>
          <h2>Termos de Uso</h2>
          <p>
            Bem-vindo ao Fynli! Este é um projeto de portfólio desenvolvido por
            Thom Gomes com o objetivo de demonstrar habilidades em
            desenvolvimento web full-stack, incluindo Next.js, React,
            TypeScript, Supabase e SWR.
          </p>
        </section>
        <section>
          <h2>Política de Privacidade</h2>
          <p>
            A sua privacidade é levada a sério. O Fynli utiliza o Supabase para
            autenticação e armazenamento de dados.
          </p>
          <ul>
            <li>
              <strong>Coleta de Dados:</strong> Coletamos apenas os dados
              essenciais para o funcionamento do aplicativo: seu e-mail, nome de
              exibição (se fornecido) e os dados financeiros (despesas, perfis,
              categorias) que você voluntariamente insere.
            </li>
            <li>
              <strong>Armazenamento de Dados:</strong> Seus dados são
              armazenados de forma segura no Supabase. Graças à Segurança a
              Nível de Linha (RLS), garantimos que apenas você tenha acesso de
              leitura e escrita aos seus próprios dados financeiros.
            </li>
            <li>
              <strong>Uso de Dados:</strong> Seus dados jamais serão vendidos,
              compartilhados ou analisados por terceiros. Eles são usados
              exclusivamente para fornecer as funcionalidades do aplicativo.
            </li>
            <li>
              <strong>Exclusão de Conta:</strong> Se desejar, você pode
              solicitar a exclusão de sua conta e de todos os dados associados a
              qualquer momento.
            </li>
          </ul>
        </section>
      </CardContent>
    </Card>
  );
}
