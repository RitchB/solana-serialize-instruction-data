import { Card } from './Card'
import { FC, useEffect, useState } from 'react'
import { Movie } from '../models/Movie'
import * as web3 from '@solana/web3.js'
import { MovieCoordinator } from "./coordinators/MovieCoordinator"
import { Button, Center, HStack, Input, Spacer } from '@chakra-ui/react'

const MOVIE_REVIEW_PROGRAM_ID = 'CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN'

export const MovieList: FC = () => {
    const connection = new web3.Connection(web3.clusterApiUrl('devnet'))
    const [movies, setMovies] = useState<Movie[]>([])
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')

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
            10,
            search,
            search !== ''
        ).then(setMovies)
    }, [page, search])

    return (
        <div>
            <Center>
                <Input
                    id='search'
                    color='gray.400'
                    onChange={event => setSearch(event.currentTarget.value)}
                    placeholder='Search'
                    w='97%'
                    mt={2}
                    mb={2}
                />
            </Center>
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