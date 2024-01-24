'use client'
import React, { useState } from 'react';
import { useForm, FormProvider, SubmitHandler, Controller, useFormContext } from 'react-hook-form';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import InputMask from 'react-input-mask';
import { debounce } from 'lodash';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';

interface FormValues {
  pessoa: { id: number; nome: string } | null;
  telefone: string;
  email: string;
}

const pessoas = [
  { id: 1, nome: 'Carlos Silva Lima' },
  { id: 2, nome: 'Carlito Ramos Junior' },
  { id: 3, nome: 'Paulo Felipe Castro' },
];

const CustomForm = () => {
  const { control, handleSubmit, reset, setValue } = useFormContext();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState([] as { id: number; nome: string }[]);
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);


  const searchPessoas = debounce(async (searchText: string) => {
    const results = pessoas.filter((pessoa) =>
      pessoa.nome.toLowerCase().includes(searchText.toLowerCase())
    );

    setSearchResults(
      results
    );
    setOpen(true);
  }, 300);

  const handleAutocompleteChange = (event, value) => {
    setInputValue(value?.nome);
    setValue('pessoa', value?.nome)
    setOpen(false)
  };

  const handleAutocompleteClear = () => {
    setSearchResults([]);
    clear();
  };

  const handleInputChange = (event, value, reason) => {
    if (reason === 'input') {
      searchPessoas(value);
      setInputValue(value);
    }
  };

  const clear = () => {
    setSuccessMessage(null);
    reset();
    setValue('pessoa', '');
    setInputValue('');
  }

  const onSubmit: SubmitHandler<FormValues> = async (data, e) => {
    e.preventDefault();

    console.log({
      pessoa: pessoas?.find(pessoa => pessoa?.nome === inputValue)?.id,
      telefone: data?.telefone,
      email: data?.email,
    });

    setSuccessMessage('Formulário enviado com sucesso!');

    setTimeout(() => {
      clear();
    }, 2000);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Controller
        name="pessoa"
        control={control}
        rules={{ required: 'Este campo é obrigatório.' }}
        defaultValue={null}
        render={({ field, fieldState }) => (
          <Autocomplete
            id="asynchronous-demo"
            options={searchResults}
            getOptionLabel={(option) => option.nome || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Pessoa"
                variant="outlined"
                fullWidth
                margin="normal"
                error={Boolean(fieldState?.error)}
                helperText={fieldState?.error?.message}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {params.InputProps.endAdornment}
                      {params.inputProps.value && (
                        <IconButton onClick={handleAutocompleteClear} size="small">
                          <ClearIcon />
                        </IconButton>
                      )}
                    </>
                  ),
                }}
              />
            )}
            value={pessoas?.find((pessoa) => pessoa?.nome === inputValue) || ''}
            inputValue={inputValue}
            onChange={handleAutocompleteChange}
            onInputChange={handleInputChange}
            getOptionSelected={(option, value) => option.nome === value}
            noOptionsText="Digitar nome existente..."
            open={open}
            onBlur={() => {
              setOpen(false);
            }}
            disableClearable={true}
          />
        )}
      />

      <Controller
        name="telefone"
        control={control}
        defaultValue=""
        rules={{ required: 'Este campo é obrigatório.' }}
        render={({ field, fieldState }) => (
          <InputMask
            mask="(99) 99999-9999"
            value={field.value}
            onChange={(e) => field.onChange(e.currentTarget.value)}
          >
            {(inputProps) => (
              <TextField
                {...inputProps}
                label="Telefone"
                variant="outlined"
                fullWidth
                margin="normal"
                error={Boolean(fieldState?.error)}
                helperText={fieldState?.error?.message}
              />
            )}
          </InputMask>
        )}
      />

      <Controller
        name="email"
        control={control}
        defaultValue=""
        rules={{
          required: 'Este campo é obrigatório.',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
            message: 'Endereço de e-mail inválido',
          },
        }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="E-mail"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            error={Boolean(fieldState?.error)}
            helperText={fieldState?.error?.message}
          />
        )}
      />

      {successMessage && (
        <div className="alert-success">
          {successMessage}
        </div>
      )}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ marginTop: 2 }}
      >
        Enviar
      </Button>
    </form>
  );
};

const App = () => {
  const methods = useForm<FormValues>();

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <FormProvider {...methods}>
          <CustomForm />
        </FormProvider>
      </Box>
    </Container>
  );
};

export default App;
