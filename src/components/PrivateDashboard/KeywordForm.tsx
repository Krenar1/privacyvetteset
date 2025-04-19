import { useState } from "react";

type KeywordProps = {
  setKeywordForm: (value: boolean) => void;
  handleAdd: (keywordData: { keyword: string; location: string }) => void;
};

function KeywordForm({ setKeywordForm, handleAdd }: KeywordProps) {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const addKeyword = () => {
    const keywordData = { keyword, location };
    handleAdd(keywordData);
    setKeyword("");
    setLocation("");
  };

  return (
    <>
      <div className="absolute w-screen top-0 bottom-0 left-0 min-h-full  z-50 flex items-center justify-center bg-black/50">
        <div className="flex items-center gap-4 text-black shadow-[0_0_1px_black] bg-gray-100 min-w-[500px] min-h-[300px] py-[30px] px-[60px] flex flex-col items-center justify-center text-white rounded-[10px] font-medium gap-[20px]">
          <form onSubmit={(event) => event.preventDefault()} className="w-full space-y-4 text-black">
            <div>
              <label htmlFor="keyword" className="block text-sm font-semibold mb-2">
                Keyword
              </label>
              <input
                id="keyword"
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full p-2 text-gray-900 rounded-lg outline outline-[1px] outline-[#d9d9d9]"
                placeholder="Enter the keyword"
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-semibold mb-2">
                Location
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2 text-gray-900 rounded-lg outline outline-[1px] outline-[#d9d9d9]"
                placeholder="Enter the location"
              />
            </div>
          </form>
          <div className="flex gap-[20px] text-gray-900 mt-4 w-full justify-between">
            <button onClick={addKeyword} className="p-2 px-4 text-white bg-primary hover:bg-[rgb(22,156,207)] active:bg-[rgb(20,127,167)] rounded-lg">
              Add Keyword
            </button>
            <button onClick={() => setKeywordForm(false)} className="p-2 px-4 text-white bg-primary hover:bg-[rgb(22,156,207)] active:bg-[rgb(20,127,167)] rounded-lg">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default KeywordForm;
