import Image from 'next/image'

import { Button } from '@/components/ui/button'

export const LoginButton = () => {
  return (
    <Button className="flex h-[54px] w-full max-w-[343px] items-center rounded-[20px] bg-white shadow-[0px_2px_3px_0px_#0000002B,0px_0px_3px_0px_#00000015]">
      <span className="flex items-center gap-[15px]">
        <Image src="/guide/Google Logo.svg" alt="Google Logo" width={24} height={24} />
        <span className="text-label-xxl text-neutral-500">Google登入</span>
      </span>
    </Button>
  )
}
