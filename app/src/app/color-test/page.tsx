export default function ColorTest() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-[#F8EFD6] mb-8">ECE Color Test</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-[#F92672] p-4 rounded-lg text-white">
          <h3>Accent</h3>
          <p>#F92672</p>
        </div>
        <div className="bg-[#A6E22E] p-4 rounded-lg text-[#272822]">
          <h3>Success</h3>
          <p>#A6E22E</p>
        </div>
        <div className="bg-[#66D9EF] p-4 rounded-lg text-[#272822]">
          <h3>Info</h3>
          <p>#66D9EF</p>
        </div>
        <div className="bg-[#E6DB74] p-4 rounded-lg text-[#272822]">
          <h3>Warning</h3>
          <p>#E6DB74</p>
        </div>
        <div className="bg-[#F8EFD6] p-4 rounded-lg text-[#272822]">
          <h3>Light</h3>
          <p>#F8EFD6</p>
        </div>
        <div className="bg-[#272822] p-4 rounded-lg text-[#F8EFD6]">
          <h3>Dark</h3>
          <p>#272822</p>
        </div>
      </div>
    </div>
  )
}