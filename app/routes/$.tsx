import Link from "~/components/link";

export function loader() {
  return new Response("Not Found", {
    status: 404,
  });
}

export default function NotFoundPage() {
  return (
    <div className='error-wrapper'>
      <div className='error-container'>
        <h2 className='error-title'>
          Oops!
        </h2>

        <div className='error-message'>
          Página não encontrada
        </div>

        <div className='error-link-container'>
          <Link to='/'>Voltar para página inicial</Link>
        </div>
      </div>
    </div>
  )
}