import React from 'react'

const Footer = () => {
  return (
    <footer className=" bg-gray-800 fixed bottom-0 w-full z-10 shadow h-auto">
    <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400 text-white">© 2023 <a href="https://flowbite.com/" className="hover:underline text-white">Flowbite™</a>. All Rights Reserved.</span>
        <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
            <li>
                <a href="#" className="hover:underline me-4 md:me-6 text-white">About</a>
            </li>
            <li>
                <a href="#" className="hover:underline me-4 md:me-6 text-white">Privacy Policy</a>
            </li>
            <li>
                <a href="#" className="hover:underline me-4 md:me-6 text-white">Licensing</a>
            </li>
            <li>
                <a href="#" className="hover:underline text-white">Contact</a>
            </li>
        </ul>
    </div>
</footer>

  )
}

export default Footer