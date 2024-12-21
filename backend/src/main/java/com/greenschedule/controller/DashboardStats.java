package com.greenschedule.controller;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardStats {
	   private long totalVehicles;
	   private long normalVehicles;
	   private long warningVehicles;
	   private long defectiveVehicles;
	   private long activeDrivers;
	}
