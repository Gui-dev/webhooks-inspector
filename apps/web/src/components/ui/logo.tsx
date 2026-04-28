export const Logo = () => {
  return (
    <div className="justify-centers relative flex w-full flex-row items-center gap-4 text-center sm:gap-6 lg:gap-8">
      <div className="relative flex items-center">
        <div className="absolute -left-3 h-3 w-3 rounded-full bg-yellow-300 sm:-left-4 sm:h-4 sm:w-4 lg:-left-6 lg:h-5 lg:w-5" />
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-300 sm:h-8 sm:w-8 lg:h-10 lg:w-10" />
        <div className="absolute -right-3 h-3 w-3 rounded-full bg-yellow-300 sm:-right-4 sm:h-4 sm:w-4 lg:-right-6 lg:h-5 lg:w-5" />
      </div>
      <span className="block font-bold text-sm text-zinc-200 sm:text-base lg:text-lg">
        webhooks<span className="font-bold text-2xl text-yellow-300">.</span>dev
      </span>
    </div>
  )
}
