import { useEffect, useReducer } from "react";
import { Form, Input, Button } from "@heroui/react";
import { Image } from "@heroui/react";

type FileUploadFormProps = {
  onChangeProp: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmitProp: (event: React.FormEvent<HTMLFormElement>) => void;
};

const initialstate =  {
    formAction: null,
    filePath: null
};

interface State {
    formAction: string | null;
    filePath: string | null;
}

interface Action {
    type: string;
    payload: string | null;
}

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "setFormAction":
            return { ...state, formAction: action.payload };
        case "setFilePath":
            return { ...state, filePath: action.payload };
        default:
            return state;
    }
};

const FileUploadForm = ({
  onChangeProp,
  onSubmitProp,
}: FileUploadFormProps) => {
  const [state, dispatch] = useReducer(reducer, initialstate);

  const newUploadFilePath = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files
      ? URL.createObjectURL(event.target.files[0])
      : null;
    dispatch({type: "setFilePath", payload: file})
  };

  useEffect(() => {
    if (state.formAction) {
      const timer = setTimeout(() => {
        dispatch({type: "setFilePath", payload: null})
        dispatch({type: "setFormAction", payload: null})
      });

      return () => clearTimeout(timer);
    }
  }, [state.formAction]);

  const Preview = ({ filePath }: { filePath: string }) => {
    return (
      <div className="max-w-[200px]">
        <Image
          className="object-cover w-max h-max max-sm:max-w-full max-w-[200px] aspect-square"
          radius="sm"
          shadow="sm"
          src={filePath}
          alt="preview"
        />
        <p className="w-full text-center font-montserrat font-normal text-sm text-[#000000] antialiased capitalize">Preview</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h3 className="text-center font-inter font-light text-base sm:text-2xl md:text-3xl antialiased self-center">Upload Stock Image</h3>
      <div className="flex flex-wrap items-center justify-center gap-4 w-full">
        {state.filePath && <Preview filePath={state.filePath} />}
        <Form
          className="w-auto max-w-[300px] md:max-w-[400px] lg:max-w-[450px] flex justify-center flex-col gap-4"
          validationBehavior="native"
          onReset={() => dispatch({type: "setFormAction", payload: "Done"})        }
          onSubmit={onSubmitProp}
        >
          <Input
            className="font-montserrat font-semibold"
            isRequired
            errorMessage="File name/title must be atleast 3 characters long."
            name="title"
            placeholder="Title"
            type="text"
            validate={(value) => {
              if (value.length < 3) {
                return "Username must be at least 3 characters long";
              }

              return value === "admin" ? "Nice try!" : null;
            }}
            onChange={onChangeProp}
          />

          <Input
            className="upload-file-input font-montserrat font-semibold text-[#685757]"
            isRequired
            errorMessage="Please select valid file(s) for upload."
            name="upload-file"
            placeholder="No file chosen"
            type="file"
            accept="image/*"
            onChange={(event) => {
              onChangeProp(event);

              newUploadFilePath(event);
            }}
          />
          <div className="flex justify-between max-sm:flex-wrap w-full gap-2">
            <Button
              className="self-center w-full"
              color="primary"
              type="submit"
            >
              Save Changes
            </Button>
            <Button className="self-center w-full" type="reset" variant="flat">
              Reset Changes
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default FileUploadForm;
