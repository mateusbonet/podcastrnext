import { GetStaticProps } from 'next';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { api } from '../services/api';
/*
import { useEffect } from 'react';
*/

type Episode = {
  id: string;
  title: string;
  members: string;
  published_at: string;
}

type HomeProps = {
  episodes: Episode[]
}

export default function Home(props: HomeProps) {

  // Exemplo de SPA
  /*
  useEffect(() => {
    fetch('http://localhost:3333/episodes')
    .then(response => response.json())
    .then(data => console.log(data))
  }, [])
  */

  return (
    <div>
      <h1>index</h1>
      <p>
        {JSON.stringify(props.episodes)}
      </p>
    </div>
  )
}

//SSG
//export async function getStaticProps() {

// SSR
export const getStaticProps: GetStaticProps = async () => {

  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const episodes = data.map (episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd mmm yy ', { locale: ptBR }),
      duration: Number(episode.file.duration),
      description: episode.file.description,
      url: episode.file.url
    }
  })
  
  return {
    props: {
      episodes: data,

    }
    //, revalidate: 60 * 60  * 8, MONTA NOVAMENTE A PÁGINA A CADA 8 HORAS
  }

}
