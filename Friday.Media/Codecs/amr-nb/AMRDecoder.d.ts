interface AMRDecoder {
    write(offset, nframes,addr);
    close();
    process(data);
    read(offset, data);
    validate(magic);
    init();
    (options);
}