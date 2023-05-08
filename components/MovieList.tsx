import { Card } from './Card'
import { FC, useEffect, useState } from 'react'
import { Movie } from '../models/Movie'
import * as web3 from '@solana/web3.js'

const MOVIE_REVIEW_PROGRAM_ID = 'CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN'

export const MovieList: FC = () => {
    const connection = new web3.Connection(web3.clusterApiUrl('devnet'))
    const [movies, setMovies] = useState<Movie[]>([])
    const [page, setPage] = useState(1)

    useEffect(() => {
        connection.getProgramAccounts(new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID)).then(async (accounts) => {
            const movies: Movie[] = accounts.map(({ account }) => {
                return Movie.deserialize(account.data)
            })

            setMovies(movies)
        })
    }, [])

    useEffect(() => {
        MovieCoordinator.fetchPage(
            connection,
            page,
            10
        ).then(setMovies)
    }, [page, search])

    return (
        <div>
            {
                movies.map((movie, i) => <Card key={i} movie={movie} />)
            }
            <Center>
                <HStack w='full' mt={2} mb={8} ml={4} mr={4}>
                    {
                        page > 1 && <Button onClick={() => setPage(page - 1)}>Previous</Button>
                    }
                    <Spacer />
                    {
                        MovieCoordinator.accounts.length > page * 2 &&
                        <Button onClick={() => setPage(page + 1)}>Next</Button>
                    }
                </HStack>
            </Center>
        </div>
    )
}