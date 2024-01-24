import React from "react";
import { Container, Grid, Typography } from "@mui/material";

const Footer = () => {
    return (
        <Container className="footer-container">
            <Grid container justifyContent="center" alignItems="center" spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="subtitle1" align="center">
                        {`Layout ©${new Date().getFullYear()} Created by Nayane Maria`}
                    </Typography>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Footer;