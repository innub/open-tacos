import Link from 'next/link'
import { basename } from 'path'
import { Dictionary } from 'underscore'

import { MediaType, MediaTagWithClimb } from '../../js/types'
import UserMedia, { ImagePlaceholder } from './UserMedia'
import { ProfileATag } from '../users/PublicProfile'

interface MoreFromThisUserProps {
  loaded: boolean
  uid: string
  mediaList?: MediaType[]
  tagMap: Dictionary<MediaTagWithClimb[]>
}

export default function MoreFromThisUser ({ loaded, uid, mediaList = [], tagMap = {} }: MoreFromThisUserProps): JSX.Element {
  return (
    <>
      <div className='block xl:grid xl:grid-cols-3 xl:gap-8 2xl:grid-cols-4 with-standard-y-margin-2x'>
        <div className='block xl:col-span-3 2xl:col-span-4 border-t border-gray-400'>
          <div className='mt-4 ml-4 lg:ml-0 font-semibold text-secondary text-lg'>
            {loaded
              ? (<><span className='tracking-tight'>More photos from</span> <ProfileATag uid={uid} /></>)
              : (<div className='h-4 w-48 bg-gray-100' />)}
          </div>
        </div>
        {!loaded && (
          <>
            <ImagePlaceholder uniqueKey='more-1' />
            <ImagePlaceholder uniqueKey='more-2' />
            <ImagePlaceholder uniqueKey='more-3' />
            <ImagePlaceholder uniqueKey='more-4' />
          </>)}
        {mediaList.map((mediaInfo, index) => {
          const tags = tagMap?.[mediaInfo.mediaId] ?? []
          const shareableUrl = `/u/${uid}/${basename(mediaInfo.filename)}`
          return (
            <Link key={mediaInfo.mediaId} href={shareableUrl} as={shareableUrl} shallow>
              <a>
                <UserMedia
                  index={index}
                  key={mediaInfo.mediaId}
                  uid={uid}
                  tagList={tags}
                  imageInfo={mediaInfo}
                  onTagDeleted={NoOP}
                  isAuthorized={false}
                />
              </a>
            </Link>
          )
        })}
      </div>
    </>

  )
}

const NoOP = (event): void => {
  event.preventDefault()
}
